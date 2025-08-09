import { ABI_HELPER, HttpStatus, TRANSACTION_STATUS } from '@/constants';
import { HexType, TxRetryOptions } from '@/types/contract';
import { retry } from 'es-toolkit';
import { BigNumberish, parseEther } from 'ethers';
import { logger } from '../logger';
import { NotFoundException } from '../error';
import { privateKeyToAccount } from 'viem/accounts';
import { http, createWalletClient, publicActions, getContract, defineChain, FeeValuesEIP1559, parseUnits } from 'viem';
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

    const account = privateKeyToAccount(ROOT_WALLET_PRIVATE_KEY as HexType);
    const client = createWalletClient({
      account,
      chain: defineChain({
        ...sepolia,
        // @dev contorl gas options for eip-1559 compatible chain
        fees: {
          baseFeeMultiplier: 2, // @dev set 100% premium for faster execution
          estimateFeesPerGas: async ({ block, multiply }) => {
            const baseFee = block.baseFeePerGas ?? 0n;
            const gweiDecimals = 9;
            const maxPriorityFeePerGas = parseUnits('2', gweiDecimals); // block producer tip, typically 1~3 gwei

            return {
              // @dev maxFeePerGas must be greater or equal to maxPriorityFeePerGas
              maxFeePerGas: multiply(baseFee) + maxPriorityFeePerGas,
              maxPriorityFeePerGas,
            };
          },
        },
      }),
      transport: http(ALCHEMY_API_ENDPOINT),
    }).extend(publicActions);

    const elif = getContract({
      address: ELIF_ADDRESS,
      abi: ABI_HELPER.elif,
      client,
    });

    return { elif, client };
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

/**
 *
 * @dev convert `amount` to ethers format and burn from `voter` as voting power
 */
export async function txCastVote({
  proposalId,
  voter,
  voteCast,
  amount,
}: {
  proposalId: number;
  voter: HexType;
  voteCast: {
    digest: HexType;
    signature: HexType;
    hasVoted: boolean;
  };
  amount: BigNumberish;
}) {
  const { elif, client } = new Elif().getInstance();
  let hash: HexType = '0x';
  let nonce: number = -1;
  let hasTracked = false;

  const target = async () => {
    const safeAmount = parseEther(amount.toString());
    const safeProposalId = BigInt(proposalId);

    hash = await elif.write.castVote([safeProposalId, voter, voteCast, safeAmount]);
  };

  const { isSuccess } = await tryWithBackOff(target);

  if (isSuccess && hash !== '0x') {
    const track = async () => {
      const hasReceipt = await client.getTransactionReceipt({ hash });
      if (!hasReceipt) {
        logger.warn(`txCastVote:track: target hash not found, throwing and retrying ...`);
        throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
          code: HttpStatus.NOT_FOUND,
        });
      }

      nonce = (await client.getTransaction({ hash })).nonce;
      logger.info(`txCastVote:track: hash(${hasReceipt.transactionHash}) found with nonce(${nonce})`);
    };
    const tracking = await tryWithBackOff(track);
    hasTracked = tracking.isSuccess;
  }

  return { isSuccess, hasTracked, hash, nonce };
}

/**
 *
 * @dev convert `amount` to ethers format and mint it `to`
 */
export async function txMint({ to, amount }: { to: HexType; amount: BigNumberish }) {
  const { elif, client } = new Elif().getInstance();
  let hash: HexType = '0x';
  let nonce: number = -1;
  let hasTracked = false;

  const mint = async () => {
    const safeAmount = parseEther(amount.toString());
    hash = await elif.write.mint([to, safeAmount]);
  };

  const { isSuccess } = await tryWithBackOff(mint);

  if (isSuccess && hash !== '0x') {
    const track = async () => {
      const hasReceipt = await client.getTransactionReceipt({ hash });
      if (!hasReceipt) {
        logger.warn(`txMint:track: target hash not found, throwing and retrying ...`);
        throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
          code: HttpStatus.NOT_FOUND,
        });
      }

      nonce = (await client.getTransaction({ hash })).nonce;
      logger.info(`txMint:track: hash(${hasReceipt.transactionHash}) found with nonce(${nonce})`);
    };
    const tracking = await tryWithBackOff(track);
    hasTracked = tracking.isSuccess;
  }
  return { isSuccess, hasTracked, hash, nonce };
}
