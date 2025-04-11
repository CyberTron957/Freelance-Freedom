import { ethers } from 'ethers';

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = '0x4E826E6738FE1F007391c07eb73742AAdF8d16C7';

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
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        }
      ],
      "name": "JobApplied",
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
        }
      ],
      "name": "applyForJob",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_jobId",
          "type": "uint256"
        }
      ],
      "name": "getJobApplicants",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
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
  if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
    console.error("MetaMask is not installed!");
    // Fallback to a default provider if needed, or handle error
    // Example: return new ethers.Contract(CONTRACT_ADDRESS, ABI, ethers.getDefaultProvider());
    // For now, let's throw an error or return null, depending on desired behavior
    throw new Error("MetaMask is not installed or window is not defined.");
  }

  // Use BrowserProvider for Ethers v6
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  let signerOrProvider;
  if (withSigner) {
    // Request accounts and get the signer if we need to send a transaction
    await provider.send("eth_requestAccounts", []);
    signerOrProvider = await provider.getSigner();
  } else {
    // Use the provider directly for read-only operations
    signerOrProvider = provider;
  }
  
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
  return contract;
};

// Create a new job
export const createJob = async (title: string, description: string) => {
  const signerContract = await getContract(true);

  // Get provider from the contract's runner (signer) in Ethers v6
  const runner = signerContract.runner;
  if (!runner?.provider) {
    throw new Error("Provider not found on contract runner (signer).");
  }
  const provider = runner.provider;

  const tx = await signerContract.createJob(title, description);
  console.log(`Transaction sent. Hash: ${tx.hash}`); // Log TX hash immediately

  // Wait for the transaction to be mined
  const receipt = await tx.wait(); 

  if (!receipt) {
    console.error("Transaction receipt is null after waiting.");
    console.error(`Transaction Hash: ${tx.hash}`);
    throw new Error("Transaction confirmation failed or receipt unavailable.");
  }

  // Parse logs from the receipt obtained via tx.wait()
  // NOTE: Using receipt.logs directly is generally preferred over fetching again unless specifically needed.
  const contractInterface = new ethers.Interface(ABI); // Use ethers.Interface in v6
  let jobCreatedEventData: ethers.LogDescription | null = null;
  const foundEventNames: string[] = []; // Track all parsed event names

  // Use receipt.logs directly
  for (const log of receipt.logs) {
      try {
          // Explicitly type parsedLog
          const parsedLog: ethers.LogDescription | null = contractInterface.parseLog({ topics: [...log.topics], data: log.data });
          if (parsedLog) {
            foundEventNames.push(parsedLog.name); // Log name regardless
            if (parsedLog.name === "JobCreated") {
                jobCreatedEventData = parsedLog;
                // Don't break; log all events found for debugging
            }
          }
      } catch (error) {
          // Log might not be from our contract, or ABI doesn't match
          // console.debug("Could not parse log:", log, error); // Optional: debug logging
          continue;
      }
  }

  if (!jobCreatedEventData || !jobCreatedEventData.args) {
    console.error("JobCreated event not found or args missing in transaction receipt logs.");
    console.error("Transaction Hash:", tx.hash);
    console.error("Final Receipt:", receipt); // Log the receipt we have
    console.error("Parsed Event Names Found:", foundEventNames); // Log found event names
    throw new Error("Could not determine Job ID after creation. Event missing or could not be parsed."); 
  }
  
  // Re-parsing to find the first event (optional if the loop logic is sufficient)
  const firstJobCreatedEvent = receipt.logs
      .map((log: ethers.Log) => { // Add explicit type for log in map
          try { 
              // Ensure log format matches what parseLog expects
              return contractInterface.parseLog({ topics: [...log.topics], data: log.data }); 
          } catch { return null; }
      })
      // Add explicit type for parsedLog in find
      .find((parsedLog: ethers.LogDescription | null) => parsedLog?.name === "JobCreated");

  if (!firstJobCreatedEvent || !firstJobCreatedEvent.args) {
      console.error("Failed to re-find JobCreated event after initial check.");
      throw new Error("Internal error processing JobCreated event.");
  }

  // In Ethers v6, BigInt is often used for uint256. Convert safely.
  const jobIdBigInt = firstJobCreatedEvent.args[0];
  const jobId = typeof jobIdBigInt === 'bigint' ? jobIdBigInt.toString() : jobIdBigInt;
  
  console.log(`Successfully found JobCreated event for Job ID: ${jobId}`);
  return jobId;
};

// Fund a job
export const fundJob = async (jobId: string | number, amount: string | number) => {
  const contract = await getContract(true);
  // Use ethers.parseEther in v6
  const amountInWei = ethers.parseEther(amount.toString()); 
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
  
  // Use ethers.formatEther in v6
  // Handle potential BigInt return values from contract
  const amount = job.amount; // Assuming job.amount is BigInt or similar
  const status = job.status; // Assuming job.status might be number or BigInt
  const createdAt = job.createdAt; // Assuming job.createdAt is BigInt
  const completedAt = job.completedAt; // Assuming job.completedAt is BigInt
  
  return {
    id: typeof job.id === 'bigint' ? job.id.toString() : job.id,
    client: job.client,
    freelancer: job.freelancer,
    amount: ethers.formatEther(amount),
    title: job.title,
    description: job.description,
    status: typeof status === 'bigint' ? Number(status) : status, // Convert BigInt status to number if needed
    createdAt: (typeof createdAt === 'bigint' ? Number(createdAt) : createdAt) * 1000, // Convert BigInt timestamp
    completedAt: (typeof completedAt === 'bigint' ? Number(completedAt) : completedAt) * 1000 // Convert BigInt timestamp
  };
};

// Get total number of jobs
export const getJobCount = async () => {
  const contract = await getContract();
  const count = await contract.getJobCount();
  // Handle potential BigInt return value
  return typeof count === 'bigint' ? count.toString() : count;
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

// New function to apply for a job
export const applyForJob = async (jobId: string | number) => {
  try {
    const contract = await getContract(true); // Need signer to send transaction
    const tx = await contract.applyForJob(jobId);
    await tx.wait();
    console.log(`Applied for job ${jobId}, transaction:`, tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new Error(parseContractError(error));
  }
};

// New function to get job applicants
export const getJobApplicants = async (jobId: string | number): Promise<string[]> => {
  try {
    const contract = await getContract();
    const applicants = await contract.getJobApplicants(jobId);
    return applicants;
  } catch (error) {
    console.error("Error getting job applicants:", error);
    throw new Error(parseContractError(error));
  }
};

// Helper to parse contract errors
const parseContractError = (error: any): string => {
  // Implement your error parsing logic here
  return "An error occurred. Please try again later or contact support.";
}; 