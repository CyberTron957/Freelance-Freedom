// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FreelancerEscrow
 * @dev A simple escrow contract for freelancers and clients to work together
 */
contract FreelancerEscrow {
    // Keep Created status in case of 0 budget jobs, though unlikely use case now
    enum JobStatus { Created, Funded, Completed, Disputed, Refunded, Cancelled }
    
    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount; // This will now hold the budget from creation
        string title;
        string description;
        JobStatus status; // Will be Funded if amount > 0, else Created
        uint256 createdAt;
        uint256 completedAt;
    }
    
    // Store all jobs in the contract
    mapping(uint256 => Job) public jobs;
    uint256 public jobCount;
    
    // Events
    event JobCreated(uint256 indexed jobId, address indexed client, string title, uint256 amount);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId);
    event JobRefunded(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);
    
    // Modifier to check if the job is funded
    modifier onlyFundedJob(uint256 _jobId) {
        require(jobs[_jobId].amount > 0, "Job must be funded");
        require(jobs[_jobId].status == JobStatus.Funded, "Job status must be Funded");
        _;
    }
    
    // Create and potentially fund a new job in one transaction
    function createJob(string memory _title, string memory _description) external payable returns (uint256) {
        uint256 jobId = jobCount++;
        uint256 budget = msg.value; // Budget is sent with the transaction
        
        JobStatus initialStatus = JobStatus.Created;
        if (budget > 0) {
            initialStatus = JobStatus.Funded; // Set status to Funded if budget provided
        }
        
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: budget, // Store the sent budget
            title: _title,
            description: _description,
            status: initialStatus,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit JobCreated(jobId, msg.sender, _title, budget); // Emit amount
        return jobId;
    }
    
    // Assign a freelancer to a funded job
    function assignFreelancer(uint256 _jobId, address _freelancer) external onlyFundedJob(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can assign a freelancer");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != job.client, "Client cannot be the freelancer");
        require(job.freelancer == address(0), "Freelancer already assigned"); // Prevent re-assignment
        
        job.freelancer = _freelancer;
        
        emit JobAssigned(_jobId, _freelancer);
    }
    
    // Complete a job - only client can mark as complete
    function completeJob(uint256 _jobId) external onlyFundedJob(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can complete this job");
        require(job.freelancer != address(0), "Job must have an assigned freelancer");
        
        // Transfer funds to freelancer
        (bool success, ) = payable(job.freelancer).call{value: job.amount}(""); // Make address payable
        require(success, "Transfer failed");
        
        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;
        
        emit JobCompleted(_jobId);
    }
    
    // Cancel a funded job - only possible before a freelancer is assigned
    function cancelJob(uint256 _jobId) external onlyFundedJob(_jobId) {
        Job storage job = jobs[_jobId];
        
        require(job.client == msg.sender, "Only the client can cancel this job");
        require(job.freelancer == address(0), "Cannot cancel if freelancer is assigned");
        
        // Return funds to client
        (bool success, ) = payable(job.client).call{value: job.amount}(""); // Make address payable
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
        require(_jobId < jobCount, "Job does not exist");
        Job storage job = jobs[_jobId]; // Use storage pointer for view function is fine
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