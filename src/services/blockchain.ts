import { ethers } from 'ethers';

// --- CONFIGURATION ---
// Set this to true to bypass wallet connection and use mock data/actions
const IS_MOCK_MODE = true; 
const MOCK_WALLET_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"; // Fake address

// Add type declaration for window.ethereum to satisfy linter in non-mock paths
declare global {
  interface Window {
    ethereum?: any; // Use a more specific type if available (e.g., Eip1193Provider)
  }
}

// Keep original constants for reference if needed
export const CONTRACT_ADDRESS = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';
export const ABI = [
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
    "name": "fundJob",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
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
    "name": "completeJob",
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
        "internalType": "uint8",
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
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "client",
        "type": "address"
      }
    ],
    "name": "JobFunded",
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
  }
];

// --- MOCK STATE --- (Simple in-memory store for demo)
let mockJobs: Map<string, any> = new Map();
let mockJobCount = 0;
let mockWalletConnected = false;
let mockUserRole: string | null = null;

// Initialize with some default mock jobs if needed
if (IS_MOCK_MODE) {
  const initialMockJobs = [
    { id: "0", client: MOCK_WALLET_ADDRESS, freelancer: "0x0000000000000000000000000000000000000000", amount: "1", title: "Mock Job 1: Build Website", description: "Mock description 1", status: 1, createdAt: Date.now() - 86400000, completedAt: 0 },
    { id: "1", client: "0xAnotherClientAddress...", freelancer: "0x0000000000000000000000000000000000000000", amount: "0.5", title: "Mock Job 2: Audit Contract", description: "Mock description 2", status: 1, createdAt: Date.now() - 172800000, completedAt: 0 },
    { id: "2", client: MOCK_WALLET_ADDRESS, freelancer: "0xfedcba9876543210fedcba9876543210abcdef01", amount: "2", title: "Mock Job 3: Mobile App", description: "Mock description 3", status: 2, createdAt: Date.now() - 259200000, completedAt: Date.now() - 86400000 },
  ];
  initialMockJobs.forEach(job => mockJobs.set(job.id, job));
  mockJobCount = initialMockJobs.length;
}


// --- WALLET & ROLE FUNCTIONS (Mocked/Original based on IS_MOCK_MODE) ---

export const saveUserRole = (role: string) => {
  if (IS_MOCK_MODE) {
    console.log(`[MOCK] Saving user role: ${role}`);
    mockUserRole = role;
    return;
  }
  // Original localStorage logic
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role);
  }
};

export const getUserRole = () => {
  if (IS_MOCK_MODE) {
     return mockUserRole;
  }
  // Original localStorage logic
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
};

export const saveWalletConnection = (address: string) => {
   if (IS_MOCK_MODE) {
    console.log(`[MOCK] Setting wallet connected: ${address}`);
    mockWalletConnected = true; // Assume address is always the mock one
    return;
  }
  // Original localStorage logic
  if (typeof window !== 'undefined') {
    localStorage.setItem('walletAddress', address);
    localStorage.setItem('walletConnected', 'true');
  }
};

export const getWalletConnection = () => {
  if (IS_MOCK_MODE) {
    return { address: mockWalletConnected ? MOCK_WALLET_ADDRESS : null, connected: mockWalletConnected };
  }
  // Original localStorage logic
  if (typeof window !== 'undefined') {
    const address = localStorage.getItem('walletAddress');
    const connected = localStorage.getItem('walletConnected') === 'true';
    return { address, connected };
  }
  return { address: null, connected: false };
};

export const clearWalletConnection = () => {
  if (IS_MOCK_MODE) {
     console.log(`[MOCK] Clearing wallet connection`);
     mockWalletConnected = false;
     return;
  }
  // Original localStorage logic
  if (typeof window !== 'undefined') {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
  }
};

export const connectWallet = async () => {
  if (IS_MOCK_MODE) {
    console.log("[MOCK] Simulating wallet connection...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    mockWalletConnected = true;
    console.log(`[MOCK] Wallet connected: ${MOCK_WALLET_ADDRESS}`);
    return MOCK_WALLET_ADDRESS;
  }
  
  // Original MetaMask logic
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        saveWalletConnection(accounts[0]); // Use the non-mock version
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

// --- CONTRACT INTERACTION FUNCTIONS (Mocked/Original based on IS_MOCK_MODE) ---

// Helper to simulate transaction delay
const simulateTransaction = async (delay = 1000) => {
  if (IS_MOCK_MODE) {
     console.log("[MOCK] Simulating transaction mining...");
     await new Promise(resolve => setTimeout(resolve, delay));
     console.log("[MOCK] Transaction 'mined'.");
  }
  // In non-mock mode, this wouldn't be called directly, tx.wait() handles it
};

// Get a contract instance (returns null in mock mode as it's not needed)
export const getContract = async (withSigner = false) => {
  if (IS_MOCK_MODE) {
    return null; // No actual contract needed for mocks
  }
  
  // Original getContract logic
  if (typeof window === 'undefined' || !window.ethereum) 
    throw new Error("MetaMask is not installed");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  if (withSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

// Create a new job
export const createJob = async (title: string, description: string) => {
  if (IS_MOCK_MODE) {
    if (!mockWalletConnected) throw new Error("Mock Wallet not connected");
    await simulateTransaction();
    const jobId = String(mockJobCount++);
    const newJob = {
      id: jobId,
      client: MOCK_WALLET_ADDRESS,
      freelancer: "0x0000000000000000000000000000000000000000", // Zero address
      amount: "0", // Created, not funded yet
      title: title,
      description: description,
      status: 0, // Created
      createdAt: Date.now(),
      completedAt: 0
    };
    mockJobs.set(jobId, newJob);
    console.log(`[MOCK] Created Job:`, newJob);
    return jobId;
  }

  // Original Blockchain logic
  const contract = await getContract(true);
  if (!contract) throw new Error("Failed to get contract instance");
  const tx = await contract.createJob(title, description);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e: any) => e.event === "JobCreated");
  if (!event || !event.args) {
    console.error("JobCreated event not found or args missing.");
    throw new Error("Could not determine Job ID after creation."); 
  }
  const jobId = event.args[0].toString(); 
  return jobId;
};

// Fund a job (Simulates funding in mock mode if called)
export const fundJob = async (jobId: string | number, amount: string | number) => {
   if (IS_MOCK_MODE) {
    console.warn(`[MOCK] fundJob called for ${jobId}. Simulating funding.`);
    const job = mockJobs.get(String(jobId));
    if (job && job.status === 0) { // Only fund if status is Created
       job.status = 1; // Funded
       job.amount = String(amount);
       console.log(`[MOCK] Updated job ${jobId} status to Funded (amount: ${amount})`);
    }
    await simulateTransaction(500); // Short delay
    return;
  }

  // Original Blockchain logic
  const contract = await getContract(true);
   if (!contract) throw new Error("Failed to get contract instance"); 
  const amountInWei = ethers.utils.parseEther(amount.toString());
  const tx = await contract.fundJob(jobId, { value: amountInWei });
  await tx.wait();
};

// Assign a freelancer to a job
export const assignFreelancer = async (jobId: string | number, freelancerAddress: string) => {
  if (IS_MOCK_MODE) {
     if (!mockWalletConnected) throw new Error("Mock Wallet not connected");
     await simulateTransaction();
     const job = mockJobs.get(String(jobId));
     if (!job) throw new Error("Mock job not found");
     if (job.client !== MOCK_WALLET_ADDRESS) throw new Error("Mock: Only client can assign");
     // Allow assignment even if not 'Funded' in mock, as funding is simulated
     // if (job.status !== 1) throw new Error("Mock: Job not funded"); 
     
     job.freelancer = freelancerAddress;
     console.log(`[MOCK] Assigned freelancer ${freelancerAddress} to job ${jobId}`);
     return;
  }

  // Original Blockchain logic
  const contract = await getContract(true);
   if (!contract) throw new Error("Failed to get contract instance"); 
  const tx = await contract.assignFreelancer(jobId, freelancerAddress);
  await tx.wait();
};

// Complete a job and release payment
export const completeJob = async (jobId: string | number) => {
   if (IS_MOCK_MODE) {
     if (!mockWalletConnected) throw new Error("Mock Wallet not connected");
     await simulateTransaction();
     const job = mockJobs.get(String(jobId));
      if (!job) throw new Error("Mock job not found");
     if (job.client !== MOCK_WALLET_ADDRESS) throw new Error("Mock: Only client can complete");
     // Allow completion even if not 'Funded' in mock, as funding is simulated
     // if (job.status !== 1) throw new Error("Mock: Job not funded"); 
     if (job.freelancer === "0x0000000000000000000000000000000000000000") throw new Error("Mock: Freelancer not assigned");

     job.status = 2; // Completed
     job.completedAt = Date.now();
     console.log(`[MOCK] Completed job ${jobId}. 'Funds' released to ${job.freelancer}`);
     return;
   }

  // Original Blockchain logic
  const contract = await getContract(true);
   if (!contract) throw new Error("Failed to get contract instance"); 
  const tx = await contract.completeJob(jobId);
  await tx.wait();
};

// Get a job by ID
export const getJob = async (jobId: string | number): Promise<any> => {
  if (IS_MOCK_MODE) {
    console.log(`[MOCK] Getting job ${jobId}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const job = mockJobs.get(String(jobId));
    if (!job) {
       console.error(`[MOCK] Job ${jobId} not found.`);
       throw new Error(`Mock Job ${jobId} not found`);
    }
    return job;
  }

  // Original Blockchain logic
  const contract = await getContract();
   if (!contract) throw new Error("Failed to get contract instance"); 
  const jobData = await contract.getJob(jobId);
  
  return {
    id: jobData.id.toString(),
    client: jobData.client,
    freelancer: jobData.freelancer,
    amount: ethers.utils.formatEther(jobData.amount),
    title: jobData.title,
    description: jobData.description,
    status: jobData.status,
    createdAt: Number(jobData.createdAt) * 1000,
    completedAt: Number(jobData.completedAt) * 1000
  };
};

// Get total number of jobs
export const getJobCount = async () => {
   if (IS_MOCK_MODE) {
     console.log(`[MOCK] Getting job count: ${mockJobCount}`);
     return String(mockJobCount);
   }

  // Original Blockchain logic
  const contract = await getContract();
   if (!contract) throw new Error("Failed to get contract instance"); 
  const count = await contract.getJobCount();
  return count.toString();
};

// Get all jobs
export const getAllJobs = async (): Promise<any[]> => {
   if (IS_MOCK_MODE) {
     console.log("[MOCK] Getting all jobs");
     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
     return Array.from(mockJobs.values());
   }

  // Original Blockchain logic (with existing TODO)
  // TODO: This fetches jobs one by one. For scalability, consider adding a 
  // contract function to return jobs in batches (pagination).
  try {
    const contract = await getContract();
    if (!contract) throw new Error("Failed to get contract instance"); 
    const count = await contract.getJobCount();
    
    const jobs = [];
    // Limit fetch in case of large number of jobs during testing
    const limit = Math.min(count, 50); // Fetch max 50 jobs for performance
    for (let i = 0; i < limit; i++) {
      try {
        // Call the formatted getJob function
        const job = await getJob(i); // Use the existing getJob which includes formatting
        jobs.push(job);
      } catch (error) {
        console.error(`Error fetching job ${i}:`, error);
        // Optionally skip or handle error for individual job fetching
      }
    }
    if (count > limit) {
       console.warn(`getAllJobs fetched only the first ${limit} of ${count} jobs.`);
    }
    
    return jobs;
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    // Return empty array or re-throw depending on desired frontend behavior
    return []; 
    // throw error; 
  }
}; 