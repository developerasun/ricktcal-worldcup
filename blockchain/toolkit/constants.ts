export const INTERFACE_ID = {
  erc20: "0x36372b07",
  erc165: "0x01ffc9a7",
  erc721: "0x80ac58cd",
  erc777: "0xe58e113c",
  erc1155: "0xd9b67a26",
};

export const HARDHAT_CONFIG_HELPER = {
  compiler: {
    enable: true,
    fee: {
      lowDeployment: 1,
      lowExecution: 1000,
    },
  },
  reportGas: true,
} as const;
