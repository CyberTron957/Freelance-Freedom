// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FreelancerEscrow
 * @dev A simple escrow contract for freelancers and clients to work together
 */
contract FreelancerEscrow {
    enum JobStatus { Created, Funded, Completed, Disputed, Refunded, Cancelled }
    
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        string title;
        string description;
        JobStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    // Store all jobs in the contract
    mapping(uint256 => Job) public jobs;
    uint256 public jobCount;
    
    // Events
    event JobCreated(uint256 indexed jobId, address indexed client, string title, uint256 amount);
    event JobFunded(uint256 indexed jobId, address indexed client);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId);
    event JobRefunded(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);
    
    // Create a new job without funding
    function createJob(string memory _title, string memory _description) external returns (uint256) {
        uint256 jobId = jobCount++;
        
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: 0,
            title: _title,
            description: _description,
            status: JobStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit JobCreated(jobId, msg.sender, _title, 0);
        return jobId;
    }
    
    // Fund an existing job
    function fundJob(uint256 _jobId) external payable {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can fund this job");
        require(job.status == JobStatus.Created, "Job must be in Created status");
        require(msg.value > 0, "Amount must be greater than 0");
        
        job.amount = msg.value;
        job.status = JobStatus.Funded;
        
        emit JobFunded(_jobId, msg.sender);
    }
    
    // Assign a freelancer to a job
    function assignFreelancer(uint256 _jobId, address _freelancer) external {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can assign a freelancer");
        require(job.status == JobStatus.Funded, "Job must be funded first");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != job.client, "Client cannot be the freelancer");
        
        job.freelancer = _freelancer;
        
        emit JobAssigned(_jobId, _freelancer);
    }
    
    // Complete a job - only client can mark as complete
    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can complete this job");
        require(job.status == JobStatus.Funded, "Job must be in Funded status");
        require(job.freelancer != address(0), "Job must have an assigned freelancer");
        
        // Transfer funds to freelancer
        (bool success, ) = job.freelancer.call{value: job.amount}("");
        require(success, "Transfer failed");
        
        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
        
        emit JobCompleted(_jobId);
    }
    
    // Cancel a job - only possible before a freelancer is assigned
    function cancelJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can cancel this job");
        require(job.status == JobStatus.Funded, "Job must be in Funded status");
        require(job.freelancer == address(0), "Cannot cancel if freelancer is assigned");
        
        // Return funds to client
        (bool success, ) = job.client.call{value: job.amount}("");
        require(success, "Transfer failed");
        
        job.status = JobStatus.Cancelled;
        
        emit JobCancelled(_jobId);
    }
    
    // Get job details
    function getJob(uint256 _jobId) external view returns (
        uint256 id,
        address client,
        address freelancer,
        uint256 amount,
        string memory title,
        string memory description,
        JobStatus status,
        uint256 createdAt,
        uint256 completedAt
    ) {
        Job memory job = jobs[_jobId];
        return (
            job.id,
            job.client,
            job.freelancer,
            job.amount,
            job.title,
            job.description,
            job.status,
            job.createdAt,
            job.completedAt
        );
    }
    
    // Get all jobs
    function getJobCount() external view returns (uint256) {
        return jobCount;
    }
} 