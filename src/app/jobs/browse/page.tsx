"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllJobs, connectWallet } from "@/services/blockchain";

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

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  
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
  
  // Load jobs from blockchain
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // In a real scenario, we would fetch from blockchain directly
        // For the demo, we'll first try to use the blockchain service
        try {
          const blockchainJobs = await getAllJobs();
          setJobs(blockchainJobs);
        } catch (err) {
          console.error("Error fetching from blockchain, using mock data:", err);
          
          // Fallback to mock data if contract is not deployed
          const mockJobs = [
            {
              id: "0",
              client: "0x123...456",
              freelancer: "0x000...000",
              amount: "1",
              title: "Build a Website",
              description: "Looking for a developer to build a portfolio website with React.",
              status: 1, // Funded
              createdAt: Date.now() - 86400000,
              completedAt: 0
            },
            {
              id: "1",
              client: "0x789...012",
              freelancer: "0x000...000",
              amount: "0.5",
              title: "Smart Contract Audit",
              description: "Need someone to audit my DeFi smart contract for security vulnerabilities.",
              status: 1, // Funded
              createdAt: Date.now() - 172800000,
              completedAt: 0
            },
            {
              id: "2",
              client: "0x345...678",
              freelancer: "0xabc...def",
              amount: "2",
              title: "Mobile App Development",
              description: "Building a cross-platform mobile app for a decentralized marketplace.",
              status: 1, // Funded
              createdAt: Date.now() - 259200000,
              completedAt: 0
            }
          ];
          setJobs(mockJobs);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Shorten address
  const shortenAddress = (address: string) => {
    if (address === "0x000...000") return address;
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
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
            {walletConnected && (
              <Link
                href="/jobs/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Post a Job
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by creating a new job posting.
              </p>
              <div className="mt-6">
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create a new job
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.id} className="p-6 hover:bg-gray-50">
                  <Link href={`/jobs/${job.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-blue-600">{job.title}</h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.amount} ETH
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {job.description}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          Client: {shortenAddress(job.client)} | Posted on {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
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
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
} 