import pkg from "hardhat";

const {ethers} = pkg;

async function main() {
  const FreelancerEscrow = await ethers.getContractFactory("FreelancerEscrow");
  console.log("Deploying FreelancerEscrow...");
  const escrow = await FreelancerEscrow.deploy();

  await escrow.deployed(); // Wait for the deployment transaction to be mined

  console.log(`FreelancerEscrow deployed to: ${escrow.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 