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

export const ABI_HELPER = {
  elif: [
    "constructor()",
    "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)",
    "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
    "error ERC20InvalidApprover(address approver)",
    "error ERC20InvalidReceiver(address receiver)",
    "error ERC20InvalidSender(address sender)",
    "error ERC20InvalidSpender(address spender)",
    "error OwnableInvalidOwner(address owner)",
    "error OwnableUnauthorizedAccount(address account)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function burn(uint256 value)",
    "function burn(address account, uint256 amount)",
    "function burnFrom(address account, uint256 value)",
    "function castVote(uint256 p, address v, (bytes32 digest, bytes signature, bool hasVoted) vc, uint256 amount)",
    "function decimals() view returns (uint8)",
    "function getRecoveredSigner(bytes32 digest, bytes signature) pure returns (address)",
    "function getVoteCastByProposal(uint256 p, address v) view returns ((bytes32 digest, bytes signature, bool hasVoted) vc)",
    "function hasVoted(uint256 p, address v) view returns (bool)",
    "function mint(address to, uint256 amount)",
    "function name() view returns (string)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)",
    "function transferOwnership(address newOwner)",
  ],
} as const;
