import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FreelancerEscrow contract...");

  const FreelancerEscrow = await ethers.getContractFactory("FreelancerEscrow");
  const freelancerEscrow = await FreelancerEscrow.deploy();

  await freelancerEscrow.waitForDeployment();
  
  const address = await freelancerEscrow.getAddress();
  console.log(`FreelancerEscrow deployed to: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 