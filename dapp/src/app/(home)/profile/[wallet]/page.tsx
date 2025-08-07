import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { TypographyH1 } from '@/components/ui/typography';
import { IVoter } from '@/types/application';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { notFound } from 'next/navigation';
import React from 'react';
import LogOutComponent from './logout';

interface Props {
  params: Promise<{ wallet: string }>;
}

async function getProfile({ wallet }: { wallet: string }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/profile/${wallet}`, {
    cache: 'no-store', // @dev prevent calling fetch build-time
  });
  const raw = await response.json();
  return { raw };
}

export default async function ProfilePage({ params }: Props) {
  const { wallet } = await params;
  const { raw } = await getProfile({ wallet });

  if (!raw) return notFound();
  const user = raw as IVoter;

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full sm:w-3/4 lg:w-1/2">
        <TypographyH1 text="프로필" />
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center items-center gap-4 border-y-2 py-4">
              <Avatar>
                <AvatarImage style={{ borderRadius: '50%' }} width={50} height={50} src="/캐릭터/버터.webp" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{user.nickname}</span>
            </div>
            <div>
              <CardTitle>지갑 주소</CardTitle>
              <CardDescription className="break-all whitespace-normal w-full">{user.wallet}</CardDescription>
            </div>
            <div>
              <CardTitle>포인트 보유량</CardTitle>
              <CardDescription>{user.point}</CardDescription>
            </div>
            <div>
              <CardTitle>엘리프 투표권 보유량</CardTitle>
              <CardDescription>{user.elif}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardAction className="flex justify-center items-center gap-2 m-auto">
          <LogOutComponent />
        </CardAction>
      </Card>
    </div>
  );
}
