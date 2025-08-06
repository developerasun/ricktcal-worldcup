import { ABI_HELPER } from '@/constants';
import { IElif, TxRetryOptions } from '@/types/contract';
import { retry } from 'es-toolkit';
import { JsonRpcProvider, Contract, Wallet, BigNumberish, BytesLike, TransactionResponse, N } from 'ethers';
import { logger } from '../logger';

export class Elif {
  constructor() {}

  private init() {
    const { ELIF_ADDRESS, ALCHEMY_API_ENDPOINT, CHAIN_NETWORK, ROOT_WALLET_PRIVATE_KEY } = process.env;
    const provider = new JsonRpcProvider(ALCHEMY_API_ENDPOINT, CHAIN_NETWORK);
    const wallet = new Wallet(ROOT_WALLET_PRIVATE_KEY, provider);
    const elif = new Contract(ELIF_ADDRESS, ABI_HELPER.elif, wallet) as Contract & IElif;

    return { elif };
  }

  getInstance() {
    return this.init();
  }
}

export async function tryWithBackOff(callback: () => Promise<void>, baseDelay = 3000) {
  const options: TxRetryOptions = {
    retries: 3,
    delay: (attempt) => baseDelay * Math.pow(2, attempt), // 3s, 6s, 12s, 24s, 48s
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
  const { elif } = new Elif().getInstance();
  let hash: null | string = null;
  let nonce: null | number = null;

  const target = async () => {
    const response = await elif.castVote(proposalId, voter, voteCast, amount);
    hash = response.hash;
    nonce = response.nonce;
  };

  const { isSuccess } = await tryWithBackOff(target);
  return { isSuccess, hash, nonce };
}

export async function txMint({ to, amount }: { to: string; amount: BigNumberish }) {
  const { elif } = new Elif().getInstance();
  let hash: null | string = null;
  let nonce: null | number = null;

  const target = async () => {
    const response = await elif.mint(to, amount);
    hash = response.hash;
    nonce = response.nonce;
  };

  const { isSuccess } = await tryWithBackOff(target);
  return { isSuccess, hash, nonce };
}
