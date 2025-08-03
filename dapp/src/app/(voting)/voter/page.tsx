import React from 'react';
import { TypographyH1 } from '@/components/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import { VoterListType } from '@/types/application';

interface Props {}

async function getVoterList() {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/voter`, {
    cache: 'no-store', // @dev prevent calling fetch build-time
  });
  const raw = await response.json();
  return { raw };
}

export default async function VotersPage({}: Props) {
  const { raw } = await getVoterList();

  if (!raw)
    return (
      <Alert variant="destructive">
        <Siren />
        <AlertTitle>서버 에러</AlertTitle>
        <AlertDescription>현재는 정상적으로 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.</AlertDescription>
      </Alert>
    );
  const data = raw as VoterListType;

  return (
    <>
      <TypographyH1 text={`투표자`} />
      <p className="text-center my-4 m-auto text-xl">현재 릭트컬 거버넌스에 참여 중인 볼따구 교주님들입니다.</p>
      <p className="text-center my-4 m-auto text-sm">*포인트 보유량이 높은 교주님 순서대로 정렬됩니다.</p>

      {data.length === 0 && (
        <Alert variant="default">
          <Siren />
          <AlertTitle>데이터 없음</AlertTitle>
          <AlertDescription>현재 등록되어 있는 투표자가 존재하지 않습니다.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((d) => {
          return (
            <Card key={d.id}>
              <CardHeader>
                <Link href={`voter/${d.id}`}>
                  <div className="flex flex-col gap-2">
                    <Avatar>
                      <AvatarImage src="/캐릭터/버터.webp" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>유저 네임</CardTitle>
                      <CardDescription>{d.nickname}</CardDescription>
                    </div>
                    <div>
                      <CardTitle>포인트 보유량</CardTitle>
                      <CardDescription>{d.point}</CardDescription>
                    </div>
                    <div>
                      <CardTitle>엘리프 투표권 보유량</CardTitle>
                      <CardDescription>{d.elif}</CardDescription>
                    </div>
                    <div>
                      <CardTitle>지갑 주소</CardTitle>
                      <CardDescription>{d.wallet.slice(0, 10) + '...' + d.wallet.slice(-5)}</CardDescription>
                    </div>
                  </div>
                </Link>
                {/* <CardAction>temp</CardAction> */}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
}
