"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getJob, assignFreelancer, completeJob, connectWallet, getWalletConnection, getUserRole, applyForJob, getJobApplicants } from "@/services/blockchain";
import { ethers } from 'ethers';

// Status enum mapping
const JobStatus = ["Created", "Funded", "Completed", "Disputed", "Refunded", "Cancelled"];

type Job = {
  id: string;
  client: string;
  freelancer: string;
  amount: string;
  title: string;
  description: string;
  status: number;
  createdAt: number;
  completedAt: number;
};

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<string[]>([]);
  const [fetchingApplicants, setFetchingApplicants] = useState(false);

  // Memoize fetchJob using useCallback to ensure stable reference
  const fetchJob = useCallback(async () => {
    if (!params.id) return;
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setApplicants([]);
    setFetchingApplicants(false);

    try {
      const jobData = await getJob(params.id as string);
      setJob(jobData);

      const { address, connected } = getWalletConnection();
      if (connected && address && jobData && jobData.client.toLowerCase() === address.toLowerCase()) {
        setFetchingApplicants(true);
        try {
          const applicantList = await getJobApplicants(params.id as string);
          setApplicants(applicantList);
        } catch (applicantError) {
          console.error("Error fetching applicants:", applicantError);
        } finally {
          setFetchingApplicants(false);
        }
      }

    } catch (err) {
      console.error("Error fetching job details from blockchain, using mock data:", err);
      setError("Failed to load job details from blockchain. Displaying mock data.");
      
      const mockJob = {
        id: params.id as string,
        client: "0x123...456",
        freelancer: params.id === "2" ? "0xabc...def" : "0x0000000000000000000000000000000000000000",
        amount: "1",
        title: "Mock Job: Build a Website",
        description: "This is mock data. Looking for a developer to build a portfolio website...",
        status: params.id === "2" ? 1 : 1,
        createdAt: Date.now() - 86400000,
        completedAt: 0
      };
      setJob(mockJob);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      if (account) {
        setWalletAddress(account);
        setWalletConnected(true);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet. Make sure MetaMask is installed and unlocked.");
    }
  };

  // Check user role on component mount
  useEffect(() => {
    const { address, connected } = getWalletConnection();
    if (connected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
      const role = getUserRole();
      setUserRole(role);
    }
  }, []);

  // Fetch job details on mount or when id changes
  useEffect(() => {
    if (walletConnected) {
      fetchJob();
    }
  }, [fetchJob, walletConnected]);

  // Check if the current user is the client or freelancer
  const isClient = walletConnected && job?.client.toLowerCase() === walletAddress.toLowerCase();
  const isPotentialFreelancer = walletConnected && !isClient && userRole === 'freelancer';
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const isUnassigned = job?.freelancer === zeroAddress;
  const isFunded = job?.status === 1;

  const handleAssignFreelancer = async () => {
    if (!job || !walletConnected) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!freelancerAddress || !ethers.isAddress(freelancerAddress)) {
        throw new Error("Please enter a valid freelancer wallet address");
      }

      await assignFreelancer(job.id, freelancerAddress);

      setSuccessMessage("Freelancer assigned successfully!");
      await fetchJob();
      setFreelancerAddress("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to assign freelancer. Please check the address and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!job || !walletConnected) return;
    
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");
    
    try {
      await completeJob(job.id);
      
      setSuccessMessage("Job completed and payment released successfully!");
      await fetchJob();
    } catch (err) {
      console.error(err);
      setError("Failed to complete job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async () => {
    if (!job || !walletConnected || isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await applyForJob(job.id);
      setSuccessMessage("Successfully applied for the job!");
    } catch (err: any) {
      console.error("Error applying for job:", err);
      setError(err.message || "Failed to apply for job. Please check console and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Shorten address
  const shortenAddress = (address: string) => {
    if (address === zeroAddress) {
      return "Not Assigned";
    }
    return address.length > 10 ? 
      `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
      address;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            FreelanceFreedom
          </Link>
          <div className="flex space-x-4">
            {!walletConnected ? (
              <button
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {shortenAddress(walletAddress)}
                </span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <Link
                  href="/jobs/browse"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Browse Jobs
                </Link>
                {userRole === 'client' && (
                  <Link
                    href="/jobs/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Post a Job
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading job details...</p>
          </div>
        ) : !job ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">Job not found</p>
            <Link href="/jobs/browse" className="mt-4 text-blue-600 hover:text-blue-800">
              Back to Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  job.status === 0
                    ? "bg-gray-100 text-gray-800"
                    : job.status === 1
                    ? "bg-green-100 text-green-800"
                    : job.status === 2
                    ? "bg-purple-100 text-purple-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {JobStatus[job.status]}
              </span>
            </div>

            <div className="px-6 py-5">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Posted by</p>
                  <p className="text-md font-medium">{isClient ? "You" : shortenAddress(job.client)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-md font-medium">{job.amount} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted on</p>
                  <p className="text-md font-medium">{formatDate(job.createdAt)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions based on role and job status */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                {isClient && job.status === 1 && isUnassigned && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Assign Freelancer</h3>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Freelancer's wallet address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={freelancerAddress}
                        onChange={(e) => setFreelancerAddress(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 ${
                          isSubmitting && "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleAssignFreelancer}
                        disabled={isSubmitting || !freelancerAddress}
                      >
                        {isSubmitting ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  </div>
                )}

                {isClient && job.status === 1 && !isUnassigned && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Complete Job</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you confirm completion, the payment of {job.amount} ETH will be released to the freelancer ({shortenAddress(job.freelancer)}). This action cannot be undone.
                    </p>
                    <button
                      className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ${
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={handleCompleteJob}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Complete Job & Release Payment"}
                    </button>
                  </div>
                )}

                {isPotentialFreelancer && isFunded && isUnassigned && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Apply for This Job</h3>
                    <p className="text-gray-700 mb-4">
                      Interested in this job? Apply now to let the client know you're available.
                    </p>
                    <button
                      className={`bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 ${
                        (isSubmitting /* || hasApplied() */) && "opacity-50 cursor-not-allowed" 
                      }`}
                      onClick={handleApply}
                      disabled={isSubmitting /* || hasApplied() */}
                    >
                      {isSubmitting ? "Applying..." : "Apply for Job"}
                    </button>
                  </div>
                )}

                {job.status === 2 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Job Completed</h3>
                    <p className="text-gray-700">
                      This job was completed on {formatDate(job.completedAt)} and the payment has been released to the freelancer ({shortenAddress(job.freelancer)}).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}