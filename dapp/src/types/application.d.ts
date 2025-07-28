import { AddressLike } from 'ethers';

export type PointClaimActionType = 'cheekpulling' | 'headpat';
export type ProposalStatusType = 'pending' | 'active' | 'approved' | 'rejected';

export interface IProposal {
  id: number;
  userId: number | null;
  isActive: number;
  status: string;
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

export type VoteCastType = 'left' | 'right';

export interface ILoginCookiePayload {
  wallet: AddressLike;
}
