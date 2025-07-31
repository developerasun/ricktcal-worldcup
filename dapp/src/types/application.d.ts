import { ProposalStatus, TRICKCAL_CHARACTERS } from '@/constants';
import { AddressLike } from 'ethers';

export type PointClaimActionType = 'cheekpulling' | 'headpat';
export type ProposalStatusType = 'pending' | 'active' | 'finished';

export interface IProposal {
  id: number;
  userId: number | null;
  status: ProposalStatus;
  title: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  leftCharacterName: string;
  rightCharacterName: string;
}

export interface IVote {
  id: number;
  userId: number | null;
  proposalId: number | null;
  voteCast: string;
}

export interface IVoter {
  id: number;
  wallet: string;
  nickname: string;
  point: number;
  elif: number;
}

export type ProposalListType = IProposal[];
export type VoterListType = IVoter[];
export type VoteListType = IVote[];

export type VoteCastType = (typeof TRICKCAL_CHARACTERS)[number];

export interface ILoginCookiePayload {
  wallet: AddressLike;
}

export interface IVoteSignPayload {
  issuer: string;
  signer: AddressLike | null;
  url: string;
  network: string;
  version: number;
  chainId: number;
  nonce: string; // @dev prevent signature replay
  timestamp: string;
  voteCast: VoteCastType;
}
