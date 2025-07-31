declare namespace NodeJS {
  export interface ProcessEnv {
    ETHERSCAN_SEPOLIA_API_KEY: string;
    ALCHEMY_API_ENDPOINT: string;

    // # ethersjs random wallet
    ROOT_WALLET_PUBLIC_KEY: string;
    ROOT_WALLET_PRIVATE_KEY: string;
    ROOT_WALLET_ADDRESS: string;
    ROOT_WALLET_MNEMONIC: string;

    // # eth-sepolia
    CHAIN_ID: string;
  }
}
