import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { IVoter } from '@/types/application';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import LogOutComponent from './logout';
import { cookies } from 'next/headers';
import { COOKIE_NAME, POINT_RATE } from '@/constants';
import { LoginRequired } from '@/components/ui/intercept';
import { AlertEmpty } from '@/components/ui/alert';
import { Spacer } from '@/components/ui/spacer';
import Link from 'next/link';
import { IconDown, IconExternalLink } from '@/components/ui/icon';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';

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
  const auth = (await cookies()).get(COOKIE_NAME.auth);

  // @dev avoid destructuring assignment here
  const rootWallet = process.env.ROOT_WALLET_ADDRESS;
  const elifAddress = process.env.ELIF_ADDRESS;

  const { wallet } = await params;
  const { raw } = await getProfile({ wallet });

  if (!raw) return notFound();
  if (!auth) return redirect('/login');

  const { user, hashes } = raw as { user: IVoter; hashes: string[] };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
        {/* left */}
        <div className="flex flex-col max-h-max justify-between">
          <TypographyH1 text="프로필" />
          <Spacer v={0.9} />
          <Card>
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

        {/* right */}
        <div>
          <TypographyH2 text="트랜잭션 내역" />
          <Link href={`https://sepolia.etherscan.io/address/${rootWallet}`} target="_blank">
            <p className="my-2 text-center opacity-70 text-sm break-all whitespace-normal w-full">
              *위탁 지갑: {rootWallet}
            </p>
          </Link>
          <Link href={`https://sepolia.etherscan.io/address/${elifAddress}`} target="_blank">
            <p className="mb-4 text-center opacity-70 text-sm break-all whitespace-normal w-full">
              *스마트 컨트랙트: {elifAddress}
            </p>
          </Link>
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            <AccordionItem value="item-1" className="p-2 border-y-1">
              <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                <span>위탁 지갑이 뭔가요</span>
                <IconDown className="w-5 h-5" />
              </AccordionTrigger>
              <AccordionContent className="mt-3 opacity-70">
                교주님을 대신하여 실제 블록체인 트랜잭션을 전송/처리 하는 지갑입니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="p-2 border-y-1">
              <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                <span>스마트 컨트랙트가 뭔가요</span>
                <IconDown className="w-5 h-5" />
              </AccordionTrigger>
              <AccordionContent className="mt-3 opacity-70">
                누구나 조회 및 사용할 수 있는 데이터베이스라고 생각하시면 됩니다. 해당 데이터베이스는 한번 배포되면
                특성상 수정이 불가능합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="p-2 border-y-1">
              <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                <span>왜 위탁을 하나요</span>
                <IconDown className="w-5 h-5" />
              </AccordionTrigger>
              <AccordionContent className="mt-3 opacity-70">
                위탁을 하지 않을 경우 교주님께서 직접 트랜잭션을 관리하고 가스비를 지불하게 됩니다. 이는 꽤나 귀찮은
                일입니다. 원활한 서비스 이용을 위해 위탁 방식으로 처리합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="p-2 border-y-1">
              <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                <span>위탁하면서 제 투표가 변조되진 않나요</span>
                <IconDown className="w-5 h-5" />
              </AccordionTrigger>
              <AccordionContent className="mt-3 opacity-70">
                투표 당시 교주님의 전자서명을 스마트 컨트랙트에 저장하고 검증합니다. 해당 스마트 컨트랙트의 소스 코드는
                투명하게 공개되어 있어 누구나 확인 및 검증이 가능합니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Spacer v={1.5} />
          {hashes.length === 0 && <AlertEmpty message="현재 제출하신 월드컵 투표가 존재하지 않습니다." />}
          {hashes.map((h, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>내 투표가 반영된 트랜잭션들</CardTitle>
                  <CardDescription>
                    <Link href={`https://sepolia.etherscan.io/tx/${h}`} target="_blank">
                      <p className="flex justify-between my-2 break-all whitespace-normal w-full">
                        <span>
                          ({index + 1}) {h}
                        </span>
                        <IconExternalLink />
                      </p>
                    </Link>
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
