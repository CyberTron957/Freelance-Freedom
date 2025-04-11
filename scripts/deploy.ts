import pkg from "hardhat";

const {ethers} = pkg;

async function main() {
  const FreelancerEscrow = await ethers.getContractFactory("FreelancerEscrow");
  console.log("Deploying FreelancerEscrow...");
  const escrow = await FreelancerEscrow.deploy();

  await escrow.waitForDeployment();

  console.log(`FreelancerEscrow deployed to: ${await escrow.getAddress()}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 