import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ProposalDetailLayout({ children }: Props) {
  return <>{children}</>;
}
