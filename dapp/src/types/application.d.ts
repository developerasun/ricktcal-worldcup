export type PointClaimActionType = 'cheekpulling' | 'headpat';
export type ProposalStatusType = 'pending' | 'active' | 'approved' | 'rejected';

export type ProposalListType = {
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
}[];

export type VoterListType = {
  id: number;
  wallet: string;
  nickname: string;
  point: number;
  elif: number;
}[];
