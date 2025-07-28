import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  signature: ReactNode;
}

export default function ProposalDetailLayout({ children, signature }: Props) {
  return (
    <>
      {children}
      {signature}
    </>
  );
}
