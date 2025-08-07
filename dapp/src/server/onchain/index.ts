import { ABI_HELPER, HttpStatus, TRANSACTION_STATUS } from '@/constants';
import { IElif, TxRetryOptions } from '@/types/contract';
import { retry } from 'es-toolkit';
import { JsonRpcProvider, Contract, Wallet, BigNumberish, BytesLike, parseEther, AlchemyProvider } from 'ethers';
import { logger } from '../logger';
import { NotFoundException } from '../error';
import { privateKeyToAccount } from 'viem/accounts';
import { http, createWalletClient, getContract, Abi } from 'viem';
import { sepolia } from 'viem/chains';

export class Elif {
  constructor() {}

  private init() {
    const { ELIF_ADDRESS, ALCHEMY_API_ENDPOINT, CHAIN_NETWORK, ROOT_WALLET_PRIVATE_KEY } = process.env;

    if (!ALCHEMY_API_ENDPOINT) {
      logger.warn('key: ', ALCHEMY_API_ENDPOINT.slice(0, 4));
      throw new NotFoundException('invalid alchemy api key');
    }
    logger.warn('network: ', CHAIN_NETWORK.slice(0, 4));
    logger.warn('api key: ', ALCHEMY_API_ENDPOINT.slice(0, 4));

    const account = privateKeyToAccount(ROOT_WALLET_PRIVATE_KEY as `0x${string}`);

    const client = createWalletClient({
      account,
      chain: sepolia,
      transport: http(ALCHEMY_API_ENDPOINT),
    });

    const elif = getContract({
      address: ELIF_ADDRESS as `0x${string}`,
      abi,
      client,
    });

    return { elif };
  }

  getInstance() {
    return this.init();
  }
}

export async function tryWithBackOff(callback: () => Promise<void>, baseDelay = 3000) {
  const options: TxRetryOptions = {
    retries: 7,
    // @dev 3s, 4.5s, 7s, 10.5s, 16s, 24s, 37s, eth-sepolia blocktime is around 12-30 sec as rule of thumb
    delay: (attempt) => {
      const baseAsRuleOfThumb = 1.52;
      logger.warn(`retrying target callback(${callback.name}) with attempt(${attempt})`);
      return baseDelay * Math.pow(baseAsRuleOfThumb, attempt);
    },
  };

  let isSuccess = false;

  try {
    await retry(callback, options);
    isSuccess = true;
  } catch (error) {
    logger.error(error);
  } finally {
    return { isSuccess };
  }
}

// export async function txCastVote({
//   proposalId,
//   voter,
//   voteCast,
//   amount,
// }: {
//   proposalId: number;
//   voter: string;
//   voteCast: {
//     digest: BytesLike;
//     signature: BytesLike;
//     hasVoted: boolean;
//   };
//   amount: BigNumberish;
// }) {
//   const { elif, provider } = new Elif().getInstance();
//   let hash: null | string = null;
//   let nonce: null | number = null;
//   let hasTracked = false;

//   const target = async () => {
//     const safeAmount = parseEther(amount.toString());
//     const response = await elif.castVote(proposalId, voter, voteCast, safeAmount);
//     hash = response.hash;
//     nonce = response.nonce;
//   };

//   const { isSuccess } = await tryWithBackOff(target);

//   if (isSuccess) {
//     const track = async () => {
//       const hasReceipt = await provider.getTransactionReceipt(hash!);
//       if (!hasReceipt) {
//         logger.warn(`txCastVote:track: target hash not found, throwing and retrying ...`);
//         throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
//           code: HttpStatus.NOT_FOUND,
//         });
//       }

//       logger.info(`txCastVote:track: hash(${hasReceipt.hash}) found with nonce(${nonce})`);
//     };
//     const tracking = await tryWithBackOff(track);
//     hasTracked = tracking.isSuccess;
//   }

//   return { isSuccess, hasTracked, hash, nonce };
// }

// export async function txMint({ to, amount }: { to: string; amount: BigNumberish }) {
//   const { elif } = new Elif().getInstance();
//   let hash: string = '';
//   let nonce: number = -1;
//   let hasTracked = false;

//   const mint = async () => {
//     const safeAmount = parseEther(amount.toString());
//     const response = await elif.write.mint([to, safeAmount]);
//     hash = response.hash;
//     nonce = response.nonce;
//   };

//   const { isSuccess } = await tryWithBackOff(mint);

//   if (isSuccess && hash.length !== 0 && nonce !== -1) {
//     const track = async () => {
//       const hasReceipt = await provider.getTransactionReceipt(hash);
//       if (!hasReceipt) {
//         logger.warn(`txMint:track: target hash not found, throwing and retrying ...`);
//         throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
//           code: HttpStatus.NOT_FOUND,
//         });
//       }

//       logger.info(`txMint:track: hash(${hasReceipt.hash}) found with nonce(${nonce})`);
//     };
//     const tracking = await tryWithBackOff(track);
//     hasTracked = tracking.isSuccess;
//   }
//   return { isSuccess, hasTracked, hash, nonce };
// }

const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allowance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSpender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'Proposal',
        name: 'p',
        type: 'uint256',
      },
      {
        internalType: 'Voter',
        name: 'v',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'digest',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'hasVoted',
            type: 'bool',
          },
        ],
        internalType: 'struct Elif.VoteCast',
        name: 'vc',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'digest',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'getRecoveredSigner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'Proposal',
        name: 'p',
        type: 'uint256',
      },
      {
        internalType: 'Voter',
        name: 'v',
        type: 'address',
      },
    ],
    name: 'getVoteCastByProposal',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'digest',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'hasVoted',
            type: 'bool',
          },
        ],
        internalType: 'struct Elif.VoteCast',
        name: 'vc',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'Proposal',
        name: 'p',
        type: 'uint256',
      },
      {
        internalType: 'Voter',
        name: 'v',
        type: 'address',
      },
    ],
    name: 'hasVoted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
