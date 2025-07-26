export type PointClaimActionType = 'cheekpulling' | 'headpat';
export type ProposalStatusType = 'active' | 'approved' | 'rejected';

export type ProposalListType = {
  id: number;
  userId: number | null;
  isActive: number;
  status: string;
  title: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
}[];

export type VoterListType = {
  id: number;
  wallet: string;
  nickname: string;
  point: number;
  elif: number;
}[];
