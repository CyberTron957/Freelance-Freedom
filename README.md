# FreelanceFreedom - Decentralized Freelance Marketplace

## Project Overview

FreelanceFreedom is a decentralized freelance marketplace built on blockchain technology as a 1-day hackathon project. The platform aims to connect freelancers and clients directly without intermediaries, using smart contracts to handle payments and escrow. It demonstrates how blockchain can address common issues in the freelance economy such as high platform fees, payment delays, and fraud.

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) with TypeScript and [Tailwind CSS](https://tailwindcss.com/)
*   **Blockchain Interaction:** [ethers.js](https://docs.ethers.io/)
*   **Smart Contracts:** [Solidity](https://docs.soliditylang.org/)
*   **Development Environment:** [Hardhat](https://hardhat.org/)

## Features

*   **Role Selection:** Users can choose between being a 'Client' or 'Freelancer'.
*   **Job Posting:** Clients can post jobs with title, description, and budget (ETH).
*   **Job Browsing:** Freelancers can browse available jobs.
*   **Escrow:** Job budget is held in the smart contract until completion.
*   **Freelancer Assignment:** Clients can assign a specific freelancer to their job.
*   **Job Completion:** Clients can mark jobs as complete, releasing funds to the freelancer.
*   **Mock Mode:** A flag to bypass wallet connection and use mock data for frontend testing.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   MetaMask browser extension (if not using Mock Mode)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd freelancefreedom
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running Locally

1.  **Compile Smart Contracts:**
    ```bash
    npx hardhat compile
    ```
2.  **Run a Local Hardhat Node:**
    (This provides local blockchain environment and test accounts with fake ETH)
    ```bash
    npx hardhat node
    ```
3.  **Deploy Smart Contract to Local Node:**
    In a separate terminal, run the deployment script (adjust script name if different):
    ```bash
    npx hardhat run scripts/deploy.ts --network localhost 
    ```
    *   Take note of the deployed contract address output by the script.
4.  **Configure Environment:**
    *   Create a `.env.local` file in the project root.
    *   Add the deployed contract address:
        ```
        NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
        ```
5.  **Run the Frontend:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
6.  **Connect MetaMask (If NOT using Mock Mode):**
    *   Open your browser to `http://localhost:3000`.
    *   Ensure MetaMask is installed.
    *   Connect MetaMask to the `Localhost 8545` network.
    *   Import one of the accounts provided by the `npx hardhat node` output (using its private key) into MetaMask. This account will have test ETH.

## Configuration

*   **Smart Contract Address:** The address of the deployed `FreelancerEscrow` contract is configured in `.env.local` via the `NEXT_PUBLIC_CONTRACT_ADDRESS` variable. The application reads this at runtime.
*   **Mock Mode:** To test the frontend without connecting to any blockchain (local or testnet) and without requiring MetaMask:
    *   Open `src/services/blockchain.ts`.
    *   Set the `IS_MOCK_MODE` constant to `true`.
    *   Restart the development server (`npm run dev`).
    *   When `IS_MOCK_MODE` is `true`, the application uses predefined mock data and simulates wallet connections/transactions.
    *   Set `IS_MOCK_MODE` back to `false` to interact with the actual contract specified in `.env.local`.

## Testing

*   **Smart Contract Tests:** Run the Solidity tests using Hardhat:
    ```bash
    npx hardhat test
    ```
*   **Frontend Testing:** Use Mock Mode as described above to test UI flows without blockchain dependency.
