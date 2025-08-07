import { ABI_HELPER, HttpStatus, TRANSACTION_STATUS } from '@/constants';
import { IElif, TxRetryOptions } from '@/types/contract';
import { retry } from 'es-toolkit';
import { JsonRpcProvider, Contract, Wallet, BigNumberish, BytesLike, parseEther, AlchemyProvider } from 'ethers';
import { logger } from '../logger';
import { NotFoundException } from '../error';

export class Elif {
  constructor() {}

  private init() {
    const { ELIF_ADDRESS, ALCHEMY_API_ENDPOINT, CHAIN_NETWORK, ROOT_WALLET_PRIVATE_KEY } = process.env;

    if (!ALCHEMY_API_ENDPOINT) {
      logger.warn('key: ', ALCHEMY_API_ENDPOINT.slice(0, 4));
      throw new NotFoundException('invalid alchemy api key');
    }
    logger.warn('network: ', CHAIN_NETWORK.slice(0, 4));

    const provider = new AlchemyProvider(CHAIN_NETWORK, ALCHEMY_API_ENDPOINT);
    const wallet = new Wallet(ROOT_WALLET_PRIVATE_KEY, provider);
    const elif = new Contract(ELIF_ADDRESS, ABI_HELPER.elif, wallet) as Contract & IElif;

    return { elif, provider, wallet };
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

export async function txCastVote({
  proposalId,
  voter,
  voteCast,
  amount,
}: {
  proposalId: number;
  voter: string;
  voteCast: {
    digest: BytesLike;
    signature: BytesLike;
    hasVoted: boolean;
  };
  amount: BigNumberish;
}) {
  const { elif, provider } = new Elif().getInstance();
  let hash: null | string = null;
  let nonce: null | number = null;
  let hasTracked = false;

  const target = async () => {
    const safeAmount = parseEther(amount.toString());
    const response = await elif.castVote(proposalId, voter, voteCast, safeAmount);
    hash = response.hash;
    nonce = response.nonce;
  };

  const { isSuccess } = await tryWithBackOff(target);

  if (isSuccess) {
    const track = async () => {
      const hasReceipt = await provider.getTransactionReceipt(hash!);
      if (!hasReceipt) {
        logger.warn(`txCastVote:track: target hash not found, throwing and retrying ...`);
        throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
          code: HttpStatus.NOT_FOUND,
        });
      }

      logger.info(`txCastVote:track: hash(${hasReceipt.hash}) found with nonce(${nonce})`);
    };
    const tracking = await tryWithBackOff(track);
    hasTracked = tracking.isSuccess;
  }

  return { isSuccess, hasTracked, hash, nonce };
}

export async function txMint({ to, amount }: { to: string; amount: BigNumberish }) {
  const { elif, provider } = new Elif().getInstance();
  let hash: string = '';
  let nonce: number = -1;
  let hasTracked = false;

  const mint = async () => {
    const safeAmount = parseEther(amount.toString());
    const response = await elif.mint(to, safeAmount);
    hash = response.hash;
    nonce = response.nonce;
  };

  const { isSuccess } = await tryWithBackOff(mint);

  if (isSuccess && hash.length !== 0 && nonce !== -1) {
    const track = async () => {
      const hasReceipt = await provider.getTransactionReceipt(hash);
      if (!hasReceipt) {
        logger.warn(`txMint:track: target hash not found, throwing and retrying ...`);
        throw new NotFoundException('존재하지 않거나 아직 블록에 포함되지 않은 트랜잭션 해시입니다.', {
          code: HttpStatus.NOT_FOUND,
        });
      }

      logger.info(`txMint:track: hash(${hasReceipt.hash}) found with nonce(${nonce})`);
    };
    const tracking = await tryWithBackOff(track);
    hasTracked = tracking.isSuccess;
  }
  return { isSuccess, hasTracked, hash, nonce };
}
