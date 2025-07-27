import Link from 'next/link';
import { Button } from './button';
import { ReactNode } from 'react';
import { Spacer } from './spacer';

interface LoginRequiredProps {
  message?: string;
  children?: ReactNode;
}

function LoginRequired({ message, children }: LoginRequiredProps) {
  return (
    <Link href="/login" className="flex flex-col justify-center items-center">
      <Button variant={'secondary'} className="cursor-pointer inline-block">
        {message ? message : '로그인하고 계속하기'}
      </Button>
      <Spacer v={1} />
      {children && <div className="pointer-events-none opacity-50">{children}</div>}
    </Link>
  );
}

export { LoginRequired };
