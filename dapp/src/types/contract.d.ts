export interface IElif {
  // ERC20
  allowance(owner: string, spender: string): Promise<bigint>;
  approve(spender: string, value: bigint): Promise<boolean>;
  balanceOf(account: string): Promise<bigint>;
  totalSupply(): Promise<bigint>;
  transfer(to: string, value: bigint): Promise<boolean>;
  transferFrom(from: string, to: string, value: bigint): Promise<boolean>;

  // Mintable
  mint(to: string, amount: bigint): Promise<HexType>;

  // Burnable
  burn(value: bigint): Promise<HexType>;
  burn(account: string, amount: bigint): Promise<HexType>;
  burnFrom(account: string, value: bigint): Promise<HexType>;

  // Metadata
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;

  // Vote-related
  castVote(
    p: bigint,
    v: string,
    vc: { digest: HexType; signature: HexType; hasVoted: boolean },
    amount: bigint
  ): Promise<HexType>;

  getVoteCastByProposal(p: bigint, v: string): Promise<{ digest: string; signature: string; hasVoted: boolean }>;

  hasVoted(p: bigint, v: string): Promise<boolean>;

  getRecoveredSigner(digest: HexType, signature: HexType): Promise<string>;

  // Ownable
  owner(): Promise<string>;
  renounceOwnership(): Promise<HexType>;
  transferOwnership(newOwner: string): Promise<HexType>;

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
