import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const {
  ETHERSCAN_SEPOLIA_API_KEY,
  ALCHEMY_API_ENDPOINT,
  ROOT_WALLET_PRIVATE_KEY,
} = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: ALCHEMY_API_ENDPOINT ? ALCHEMY_API_ENDPOINT : "",
      accounts: [ROOT_WALLET_PRIVATE_KEY ? ROOT_WALLET_PRIVATE_KEY : ""],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_SEPOLIA_API_KEY ? ETHERSCAN_SEPOLIA_API_KEY : "",
    },
  },
};

export default config;
