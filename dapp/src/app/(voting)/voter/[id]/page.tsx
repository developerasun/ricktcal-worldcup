import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { notFound } from 'next/navigation';
import { VoterProfileType } from '@/types/application';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Spacer } from '@/components/ui/spacer';
interface Props {
  params: Promise<{ id: string }>;
}

async function getVoter({ userId }: { userId: string }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/voter/${userId}`, {
    cache: 'no-store', // @dev prevent calling fetch build-time
  });
  const raw = await response.json();
  return { raw };
}

export default async function VoterDetail({ params }: Props) {
  const { id: userId } = await params;
  const { raw } = await getVoter({ userId });

  if (!raw) return notFound();
  const data = raw as VoterProfileType;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8">
        {/* left */}
        <Card>
          <TypographyH1 text="프로필" />
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center items-center gap-4 border-y-2 py-4">
                <Avatar>
                  <AvatarImage style={{ borderRadius: '50%' }} width={50} height={50} src="/캐릭터/버터.webp" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{data.user.nickname}</span>
              </div>
              <div>
                <CardTitle>지갑 주소</CardTitle>
                <CardDescription className="break-all whitespace-normal w-full">{data.user.wallet}</CardDescription>
              </div>
              <div>
                <CardTitle>포인트 보유량</CardTitle>
                <CardDescription>{data.user.point}</CardDescription>
              </div>
              <div>
                <CardTitle>엘리프 투표권 보유량</CardTitle>
                <CardDescription>{data.user.elif}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* right */}
        <div>
          <TypographyH2 text="참여 월드컵 내역" />
          <Spacer v={1.5} />
          {data.voteHistory.map((v) => {
            return (
              <Card key={v.proposals.id}>
                <CardHeader>
                  <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-4">
                    <div className="flex flex-col gap-2">
                      <div>
                        <CardTitle>월드컵 타이틀</CardTitle>
                        <CardDescription>{v.proposals.title}</CardDescription>
                      </div>
                      <div>
                        <CardTitle>소개글</CardTitle>
                        <CardDescription>{v.proposals.description}</CardDescription>
                      </div>
                      <div>
                        <CardTitle>진행 상황</CardTitle>
                        <CardDescription>{v.proposals.status}</CardDescription>
                      </div>
                      <div>
                        <CardTitle>투표 내역</CardTitle>
                        <CardDescription>
                          {v.votes.voteCast}에게 {v.votes.elifAmount} 엘리프를 투표하셨습니다.
                        </CardDescription>
                      </div>
                    </div>
                    <Avatar className="flex justify-center items-center gap-2 overflow-auto">
                      <div className="flex flex-col items-center">
                        <AvatarImage
                          className="rounded-full"
                          width={75}
                          height={75}
                          src={`/캐릭터/${v.proposals.leftCharacterName}.webp`}
                        />
                        <span>{v.proposals.leftCharacterName}</span>
                      </div>
                      <p className="font-bold">VS</p>
                      <div className="flex flex-col items-center">
                        <AvatarImage
                          className="rounded-full"
                          width={75}
                          height={75}
                          src={`/캐릭터/${v.proposals.rightCharacterName}.webp`}
                        />
                        <span>{v.proposals.rightCharacterName}</span>
                      </div>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
