"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getJob, assignFreelancer, completeJob, connectWallet } from "@/services/blockchain";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

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

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // Try to get the job from blockchain
        try {
          const jobData = await getJob(params.id as string);
          setJob(jobData);
        } catch (err) {
          console.error("Error fetching from blockchain, using mock data:", err);
          
          // Mock data for demo if contract not deployed
          const mockJob = {
            id: params.id as string,
            client: "0x123...456",
            freelancer: params.id === "2" ? "0xabc...def" : "0x000...000",
            amount: "1",
            title: "Build a Website",
            description: "Looking for a developer to build a portfolio website with React. Must have experience with Next.js, Tailwind CSS, and responsive design. The website should include a homepage, about page, portfolio section, and contact form. All code should be clean, well-documented, and optimized for performance. Expected timeline is 2 weeks with regular progress updates.",
            status: params.id === "2" ? 1 : 1, // Funded
            createdAt: Date.now() - 86400000,
            completedAt: 0
          };
          setJob(mockJob);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [params.id]);

  // Check if the current user is the client or freelancer
  const isClient = walletConnected && job?.client.toLowerCase() === walletAddress.toLowerCase();
  const isFreelancer = walletConnected && job?.freelancer.toLowerCase() === walletAddress.toLowerCase();
  const isUnassigned = job?.freelancer === "0x0000000000000000000000000000000000000000" || job?.freelancer === "0x000...000";

  const handleAssignFreelancer = async () => {
    if (!job || !walletConnected) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      if (!freelancerAddress) {
        throw new Error("Please enter a freelancer address");
      }
      
      // Assign the freelancer on blockchain
      await assignFreelancer(job.id, freelancerAddress);
      
      // Refresh page
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Failed to assign freelancer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!job || !walletConnected) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Complete the job on blockchain
      await completeJob(job.id);
      
      // Redirect to jobs page
      router.push("/jobs/browse");
    } catch (err) {
      console.error(err);
      setError("Failed to complete job. Please try again.");
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
    if (address === "0x000...000" || address === "0x0000000000000000000000000000000000000000") {
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
                <Link
                  href="/jobs/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Post a Job
                </Link>
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
                  <p className="text-md font-medium">{shortenAddress(job.client)}</p>
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

              {!walletConnected && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please connect your wallet to interact with this job.
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={handleConnectWallet}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                          Connect Wallet
                        </button>
                      </div>
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
                    <p className="mb-4 text-gray-700">
                      Once you complete this job, the funds will be released to the freelancer.
                      This action cannot be undone.
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

                {isFreelancer && job.status === 1 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">You're Assigned to This Job</h3>
                    <p className="text-gray-700">
                      You've been assigned to this job. When you complete the work, the client
                      will release the payment to your wallet.
                    </p>
                  </div>
                )}

                {walletConnected && !isClient && !isFreelancer && job.status === 1 && isUnassigned && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Apply for This Job</h3>
                    <p className="text-gray-700 mb-4">
                      Interested in this job? Contact the client directly to discuss details.
                    </p>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => alert("In a real app, this would open a messaging system.")}
                    >
                      Contact Client
                    </button>
                  </div>
                )}

                {job.status === 2 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Job Completed</h3>
                    <p className="text-gray-700">
                      This job has been completed and the payment has been released to the freelancer.
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