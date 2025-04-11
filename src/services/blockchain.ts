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
  }
];

// Helper function to connect to MetaMask
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
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
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

// Create a new job
export const createJob = async (title, description) => {
  const contract = await getContract(true);
  const tx = await contract.createJob(title, description);
  const receipt = await tx.wait();
  
  // Get the job ID from the event
  const event = receipt.logs.find(log => 
    log.topics[0] === ethers.id("JobCreated(uint256,address,string,uint256)")
  );
  
  // The first indexed parameter is the job ID
  const jobId = ethers.getBigInt(event.topics[1]);
  return jobId;
};

// Fund a job
export const fundJob = async (jobId, amount) => {
  const contract = await getContract(true);
  const amountInWei = ethers.parseEther(amount.toString());
  const tx = await contract.fundJob(jobId, { value: amountInWei });
  await tx.wait();
};

// Assign a freelancer to a job
export const assignFreelancer = async (jobId, freelancerAddress) => {
  const contract = await getContract(true);
  const tx = await contract.assignFreelancer(jobId, freelancerAddress);
  await tx.wait();
};

// Complete a job and release payment
export const completeJob = async (jobId) => {
  const contract = await getContract(true);
  const tx = await contract.completeJob(jobId);
  await tx.wait();
};

// Get a job by ID
export const getJob = async (jobId) => {
  const contract = await getContract();
  const job = await contract.getJob(jobId);
  
  return {
    id: job.id.toString(),
    client: job.client,
    freelancer: job.freelancer,
    amount: ethers.formatEther(job.amount),
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
}; 