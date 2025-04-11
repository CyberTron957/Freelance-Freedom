"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJob, fundJob, connectWallet, getWalletConnection } from "@/services/blockchain";

export default function CreateJob() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Connect wallet on page load
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!walletConnected) {
        await handleConnectWallet();
        // Re-check connection status after attempting to connect
        const currentConnection = getWalletConnection(); 
        if (!currentConnection.connected) {
          throw new Error("Please connect your wallet first");
        }
        // Update state if connection was successful within handleSubmit
        setWalletConnected(true);
        setWalletAddress(currentConnection.address || ""); 
      }

      // Create the job on blockchain
      console.log("Creating job...");
      const jobId = await createJob(title, description);
      console.log(`Job created with ID: ${jobId}`);
      
      // --- MOCK FOR TESTING --- 
      // Skip actual funding as requested, job state will remain 'Created' on-chain.
      // await fundJob(jobId, budget); 
      console.warn(`Skipping funding for job ${jobId} for testing purposes.`);
      // --- END MOCK --- 
      
      // Redirect to the newly created job detail page
      router.push(`/jobs/${jobId}`); 
    } catch (err: any) {
      console.error("Job creation failed:", err);
      setError(err.message || "Failed to create job. Please check console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            FreelanceFreedom
          </Link>
          <div>
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
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
          
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
                    Please connect your wallet first to post a job.
                  </p>
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

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                id="description"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget (ETH)
              </label>
              <input
                type="number"
                id="budget"
                step="0.001"
                min="0.000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                This amount will be locked in the smart contract until the job is completed.
              </p>
            </div>

            <div className="flex justify-end">
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-4 hover:bg-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  isLoading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 