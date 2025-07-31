import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { HARDHAT_CONFIG_HELPER } from "./toolkit/constants";
dotenv.config();

const {
  ETHERSCAN_SEPOLIA_API_KEY,
  ALCHEMY_API_ENDPOINT,
  ROOT_WALLET_PRIVATE_KEY,
} = process.env;

const options = {
  settings: {
    optimizer: {
      enabled: HARDHAT_CONFIG_HELPER.compiler.enable,
      runs: HARDHAT_CONFIG_HELPER.compiler.fee.lowDeployment,
    },
  },
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    // set multiple compiler version
    // prettier-ignore
    compilers: [
      { version: "0.8.0" }, 
      { version: "0.8.4" }, 
      { version: "0.8.20" }
    ].map((ver) => {
      return {
        ...ver,
        ...options,
      };
    }),
  },
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
