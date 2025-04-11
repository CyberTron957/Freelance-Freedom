import { ethers } from 'ethers';

// Replace with your deployed contract address
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
  const contract = await getContract(true);
  const tx = await contract.createJob(title, description);
  const receipt = await tx.wait();
  
  // Confirmed: The contract emits a JobCreated event with jobId as the first indexed arg.
  // Parsing the event from the receipt is the standard way to get this value.
  const event = receipt.events?.find((e: any) => e.event === "JobCreated");

  if (!event || !event.args) {
    console.error("JobCreated event not found or args missing in transaction receipt.");
    throw new Error("Could not determine Job ID after creation. Event missing."); 
  }
  
  // The first indexed parameter is the jobId.
  const jobId = event.args[0].toString(); 
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