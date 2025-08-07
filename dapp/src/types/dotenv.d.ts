declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTJS_ENV: 'development' | 'production' | 'test';

    BEARER_TOKEN: string;
    COOKIE_SECRET: string;

    ETHERSCAN_SEPOLIA_API_KEY: string;
    ALCHEMY_API_ENDPOINT: string;

    ROOT_WALLET_PUBLIC_KEY: `0x${string}`;
    ROOT_WALLET_PRIVATE_KEY: `0x${string}`;
    ROOT_WALLET_ADDRESS: `0x${string}`;
    ROOT_WALLET_MNEMONIC: string;

    ELIF_ADDRESS: `0x${string}`;
    NEXT_PUBLIC_ELIF_ADDRESS: string;

    CHAIN_ID: string;
    CHAIN_NETWORK: string;

    BASE_ENDPOINT: string;
  }
}
