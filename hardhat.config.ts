import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20", // Make sure this matches your contract's pragma
  networks: {
    // Optional: Keep hardhat network for local testing without external node
    hardhat: {},
    // Add Ganache network configuration
    ganache: {
      url: "https://g.udk.me", // Or 8545 for CLI, or whatever Ganache shows
      // Optional: Specify accounts if needed, Hardhat usually picks them up
      // accounts: [process.env.GANACHE_PRIVATE_KEY || ''] // Example using env var
    }
  },
  // Optional: Add other configurations like Etherscan API keys if needed later
};

export default config;