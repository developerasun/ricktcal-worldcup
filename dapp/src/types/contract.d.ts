import { BigNumberish, BytesLike, TransactionResponse } from 'ethers';

export interface IElif {
  // ERC20
  allowance(owner: string, spender: string): Promise<BigNumberish>;
  approve(spender: string, value: BigNumberish): Promise<boolean>;
  balanceOf(account: string): Promise<BigNumberish>;
  totalSupply(): Promise<BigNumberish>;
  transfer(to: string, value: BigNumberish): Promise<boolean>;
  transferFrom(from: string, to: string, value: BigNumberish): Promise<boolean>;

  // Mintable
  mint(to: string, amount: BigNumberish): Promise<TransactionResponse>;

  // Burnable
  burn(value: BigNumberish): Promise<TransactionResponse>;
  burn(account: string, amount: BigNumberish): Promise<TransactionResponse>;
  burnFrom(account: string, value: BigNumberish): Promise<TransactionResponse>;

  // Metadata
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;

  // Vote-related
  castVote(
    p: BigNumberish,
    v: string,
    vc: { digest: BytesLike; signature: BytesLike; hasVoted: boolean },
    amount: BigNumberish
  ): Promise<TransactionResponse>;

  getVoteCastByProposal(p: BigNumberish, v: string): Promise<{ digest: string; signature: string; hasVoted: boolean }>;

  hasVoted(p: BigNumberish, v: string): Promise<boolean>;

  getRecoveredSigner(digest: BytesLike, signature: BytesLike): Promise<string>;

  // Ownable
  owner(): Promise<string>;
  renounceOwnership(): Promise<TransactionResponse>;
  transferOwnership(newOwner: string): Promise<TransactionResponse>;

  // Events (if you're indexing or listening via `contract.on`)
  // Not included in method interface, but you could type them separately if needed
}

export interface TxRetryOptions {
  /**
   * Delay between retries. Can be a static number (milliseconds) or a function
   * that computes delay dynamically based on the current attempt.
   *
   * @default 0
   * @example
   * delay: (attempts) => attempt * 50
   */
  delay?: number | ((attempts: number) => number);
  /**
   * The number of retries to attempt.
   * @default Number.POSITIVE_INFINITY
   */
  retries?: number;
  /**
   * An AbortSignal to cancel the retry operation.
   */
  signal?: AbortSignal;
}

export type HexType = `0x${string}`;
