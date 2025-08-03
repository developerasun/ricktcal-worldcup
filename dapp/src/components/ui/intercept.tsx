import Link from 'next/link';
import { Button } from './button';
import { ReactNode } from 'react';
import { Spacer } from './spacer';
import { IAuth } from '@/types/application';

interface LoginRequiredProps {
  message?: string;
  children?: ReactNode;
  auth?: IAuth;
}

function LoginRequired({ auth, message, children }: LoginRequiredProps) {
  return (
    <>
      {auth && children}
      {!auth && (
        <Link href="/login" className="flex flex-col justify-center items-center">
          <Button variant={'secondary'} className="cursor-pointer inline-block">
            {message ? message : '로그인하고 계속하기'}
          </Button>
          <Spacer v={1} />
          <div className="pointer-events-none opacity-50">{children}</div>
        </Link>
      )}
    </>
  );
}

export { LoginRequired };
