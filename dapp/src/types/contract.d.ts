import { BigNumberish, BytesLike } from 'ethers';

export interface IElif {
  // ERC20
  allowance(owner: string, spender: string): Promise<BigNumberish>;
  approve(spender: string, value: BigNumberish): Promise<boolean>;
  balanceOf(account: string): Promise<BigNumberish>;
  totalSupply(): Promise<BigNumberish>;
  transfer(to: string, value: BigNumberish): Promise<boolean>;
  transferFrom(from: string, to: string, value: BigNumberish): Promise<boolean>;

  // Burnable
  burn(value: BigNumberish): Promise<void>;
  burn(account: string, amount: BigNumberish): Promise<void>;
  burnFrom(account: string, value: BigNumberish): Promise<void>;

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
  ): Promise<void>;

  getVoteCastByProposal(p: BigNumberish, v: string): Promise<{ digest: string; signature: string; hasVoted: boolean }>;

  hasVoted(p: BigNumberish, v: string): Promise<boolean>;

  getRecoveredSigner(digest: BytesLike, signature: BytesLike): Promise<string>;

  // Ownable
  owner(): Promise<string>;
  renounceOwnership(): Promise<void>;
  transferOwnership(newOwner: string): Promise<void>;

  // Events (if you're indexing or listening via `contract.on`)
  // Not included in method interface, but you could type them separately if needed
}
