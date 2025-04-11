import { ethers } from 'ethers';

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = '0x2d697F6fB489326eCaaBce7fC67678D3E8B838B1'
export const CONTRACT_ADDRESS = '0x2d697F6fB489326eCaaBce7fC67678D3E8B838B1'

export const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        }
      ],
      "name": "JobAssigned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "JobCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "JobCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "JobCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "JobDisputed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "jobId",
          "type": "uint256"
        }
      ],
      "name": "JobRefunded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_freelancer",
          "type": "address"
        }
      ],
      "name": "assignFreelancer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "cancelJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "completeJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "createJob",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "getJob",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "enum FreelancerEscrow.JobStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getJobCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "jobCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "jobs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "enum FreelancerEscrow.JobStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

// Add ethers window extension
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Store user's role (client or freelancer)
export const saveUserRole = (role: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role);
  }
};

export const getUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
};

// Store wallet connection data in localStorage
export const saveWalletConnection = (address: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('walletAddress', address);
    localStorage.setItem('walletConnected', 'true');
  }
};

export const getWalletConnection = () => {
  if (typeof window !== 'undefined') {
    const address = localStorage.getItem('walletAddress');
    const connected = localStorage.getItem('walletConnected') === 'true';
    return { address, connected };
  }
  return { address: null, connected: false };
};

export const clearWalletConnection = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
  }
};

// Helper function to connect to MetaMask
export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        saveWalletConnection(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  } else {
    console.error("MetaMask is not installed");
    return null;
  }
};

// Get a contract instance
export const getContract = async (withSigner = false) => {
  if (typeof window === 'undefined' || !window.ethereum) 
    throw new Error("MetaMask is not installed");
  
  // Use Web3Provider instead of BrowserProvider for ethers v5
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  if (withSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

// Create a new job
export const createJob = async (title: string, description: string) => {
  const signerContract = await getContract(true);
  const provider = signerContract.provider;

  const tx = await signerContract.createJob(title, description);
  console.log(`Transaction sent. Hash: ${tx.hash}`); // Log TX hash immediately

  // Wait for the transaction to be mined
  await tx.wait(); 

  // Add a delay
  await new Promise(resolve => setTimeout(resolve, 2000)); // Keep 2s for now

  // Explicitly fetch the transaction receipt again
  const finalReceipt = await provider.getTransactionReceipt(tx.hash);

  if (!finalReceipt) {
      console.error("Could not fetch final transaction receipt.");
      console.error(`Transaction Hash: ${tx.hash}`); 
      throw new Error("Transaction confirmation failed or receipt unavailable.");
  }

  // Parse logs
  const contractInterface = new ethers.utils.Interface(ABI);
  let jobCreatedEventData: ethers.utils.LogDescription | null = null;
  const foundEventNames: string[] = []; // Track all parsed event names

  for (const log of finalReceipt.logs) {
      try {
          const parsedLog = contractInterface.parseLog(log);
          foundEventNames.push(parsedLog.name); // Log name regardless
          if (parsedLog.name === "JobCreated") {
              jobCreatedEventData = parsedLog;
              // Don't break; log all events found for debugging
          }
      } catch (error) {
          continue;
      }
  }

  if (!jobCreatedEventData || !jobCreatedEventData.args) {
    console.error("JobCreated event not found or args missing in final transaction receipt logs.");
    console.error("Transaction Hash:", tx.hash);
    console.error("Final Receipt:", finalReceipt);
    console.error("Parsed Event Names Found:", foundEventNames); // Log found event names
    throw new Error("Could not determine Job ID after creation. Event missing or could not be parsed."); 
  const signerContract = await getContract(true);
  const provider = signerContract.provider;

  const tx = await signerContract.createJob(title, description);
  console.log(`Transaction sent. Hash: ${tx.hash}`); // Log TX hash immediately

  // Wait for the transaction to be mined
  await tx.wait(); 

  // Add a delay
  await new Promise(resolve => setTimeout(resolve, 2000)); // Keep 2s for now

  // Explicitly fetch the transaction receipt again
  const finalReceipt = await provider.getTransactionReceipt(tx.hash);

  if (!finalReceipt) {
      console.error("Could not fetch final transaction receipt.");
      console.error(`Transaction Hash: ${tx.hash}`); 
      throw new Error("Transaction confirmation failed or receipt unavailable.");
  }

  // Parse logs
  const contractInterface = new ethers.utils.Interface(ABI);
  let jobCreatedEventData: ethers.utils.LogDescription | null = null;
  const foundEventNames: string[] = []; // Track all parsed event names

  for (const log of finalReceipt.logs) {
      try {
          const parsedLog = contractInterface.parseLog(log);
          foundEventNames.push(parsedLog.name); // Log name regardless
          if (parsedLog.name === "JobCreated") {
              jobCreatedEventData = parsedLog;
              // Don't break; log all events found for debugging
          }
      } catch (error) {
          continue;
      }
  }

  if (!jobCreatedEventData || !jobCreatedEventData.args) {
    console.error("JobCreated event not found or args missing in final transaction receipt logs.");
    console.error("Transaction Hash:", tx.hash);
    console.error("Final Receipt:", finalReceipt);
    console.error("Parsed Event Names Found:", foundEventNames); // Log found event names
    throw new Error("Could not determine Job ID after creation. Event missing or could not be parsed."); 
  }
  
  // Find the *first* JobCreated event if multiple were somehow emitted (unlikely)
  const firstJobCreatedEvent = finalReceipt.logs
      .map(log => {
          try { return contractInterface.parseLog(log); } catch { return null; }
      })
      .find(parsedLog => parsedLog?.name === "JobCreated");

  if (!firstJobCreatedEvent || !firstJobCreatedEvent.args) {
      // This case should theoretically not be reached if the previous check passed,
      // but added for robustness.
      console.error("Failed to re-find JobCreated event after initial check.");
      throw new Error("Internal error processing JobCreated event.");
  }

  const jobId = firstJobCreatedEvent.args[0].toString(); 
  console.log(`Successfully found JobCreated event for Job ID: ${jobId}`);
  // Find the *first* JobCreated event if multiple were somehow emitted (unlikely)
  const firstJobCreatedEvent = finalReceipt.logs
      .map(log => {
          try { return contractInterface.parseLog(log); } catch { return null; }
      })
      .find(parsedLog => parsedLog?.name === "JobCreated");

  if (!firstJobCreatedEvent || !firstJobCreatedEvent.args) {
      // This case should theoretically not be reached if the previous check passed,
      // but added for robustness.
      console.error("Failed to re-find JobCreated event after initial check.");
      throw new Error("Internal error processing JobCreated event.");
  }

  const jobId = firstJobCreatedEvent.args[0].toString(); 
  console.log(`Successfully found JobCreated event for Job ID: ${jobId}`);
  return jobId;
};

// Fund a job
export const fundJob = async (jobId: string | number, amount: string | number) => {
  const contract = await getContract(true);
  const amountInWei = ethers.utils.parseEther(amount.toString());
  const tx = await contract.fundJob(jobId, { value: amountInWei });
  await tx.wait();
};

// Assign a freelancer to a job
export const assignFreelancer = async (jobId: string | number, freelancerAddress: string) => {
  const contract = await getContract(true);
  const tx = await contract.assignFreelancer(jobId, freelancerAddress);
  await tx.wait();
};

// Complete a job and release payment
export const completeJob = async (jobId: string | number) => {
  const contract = await getContract(true);
  const tx = await contract.completeJob(jobId);
  await tx.wait();
};

// Get a job by ID
export const getJob = async (jobId: string | number) => {
  const contract = await getContract();
  const job = await contract.getJob(jobId);
  
  return {
    id: job.id.toString(),
    client: job.client,
    freelancer: job.freelancer,
    amount: ethers.utils.formatEther(job.amount),
    title: job.title,
    description: job.description,
    status: job.status,
    createdAt: Number(job.createdAt) * 1000, // Convert to JavaScript timestamp
    completedAt: Number(job.completedAt) * 1000
  };
};

// Get total number of jobs
export const getJobCount = async () => {
  const contract = await getContract();
  const count = await contract.getJobCount();
  return count.toString();
};

// Get all jobs (limited by count)
export const getAllJobs = async () => {
  // TODO: This fetches jobs one by one. For scalability, consider adding a 
  // contract function to return jobs in batches (pagination).
  try {
    const contract = await getContract();
    const count = await contract.getJobCount();
    
    const jobs = [];
    for (let i = 0; i < count; i++) {
      try {
        const job = await getJob(i);
        jobs.push(job);
      } catch (error) {
        console.error(`Error fetching job ${i}:`, error);
      }
    }
    
    return jobs;
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    throw error;
  }
}; 