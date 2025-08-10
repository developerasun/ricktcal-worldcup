import { ProposalStatus, TRICKCAL_CHARACTERS } from '@/constants';
import React from 'react';

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
  leftCharacterElif: number;
  rightCharacterElif: number;
}

// @dev matched with /api/proposal/[id]
export interface IVote {
  id: number;
  userId: number;
  proposalId: number | null;
  voteCast: string;
  elifAmount: number;
  digest: string;
  signature: string;
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
export type VoterProfileType = { user: IVoter; voteHistory: { votes: IVote; proposals: IProposal }[] };

export interface ILoginCookiePayload {
  wallet: string;
}

export interface IVoteSignPayload {
  issuer: string;
  signer: string | null;
  url: string;
  network: string;
  version: number;
  chainId: number;
  nonce: string; // @dev prevent signature replay
  timestamp: string;
  voteCast: VoteCastType;
  votingPower: string;
}

export interface IAccountCredentials {
  address: string;
  mnemonic: string | undefined;
  nickname: string;
}

export interface IAuth {
  wallet: string;
}

export interface IAuthContext {
  auth: IAuth | undefined;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | undefined>>;
}
