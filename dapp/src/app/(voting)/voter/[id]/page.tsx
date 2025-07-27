import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { IconConstruction } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
interface Props {}

export default function VoterDetail({}: Props) {
  return (
    <div>
      <Alert
        className="flex flex-col justify-center items-center gap-2 w-1/2 h-1/2 sm:w-1/3 sm:h-1/3"
        variant="default"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <IconConstruction />
        <AlertTitle className="text-xl font-bold">공사 중</AlertTitle>
        <AlertDescription>준비 중인 페이지입니다.</AlertDescription>
        <Link href={'/'}>
          <Button>돌아가기</Button>
        </Link>
      </Alert>
    </div>
  );
}
