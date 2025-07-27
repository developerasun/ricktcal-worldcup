import { TypographyH1 } from '@/components/ui/typography';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { IProposal, VoteListType } from '@/types/application';
import { notFound } from 'next/navigation';
import { Spacer } from '@/components/ui/spacer';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProposalDetail({ id }: { id: number }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal?proposalId=${id}`);
  const data = (await response.json()) as { proposal: IProposal; voteHistory: VoteListType };

  return data;
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const data = await getProposalDetail({ id: +id });

  if (!data) return notFound();

  return (
    <>
      <TypographyH1 text={`최애 사도 월드컵 #${data.proposal.id}`} />

      <Spacer v={2} />
      <div className="flex justify-center items-center gap-2">
        <div className="flex flex-col justify-center items-center gap-2">
          <Image
            width={200}
            height={200}
            style={{ borderRadius: '50%' }}
            src={`/캐릭터/${data.proposal.leftCharacterName}.webp`}
            alt="left-character"
          />
          <span>{data.proposal.leftCharacterName}</span>
        </div>

        <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>VS</p>
        <div className="flex flex-col justify-center items-center gap-2">
          <Image
            width={200}
            height={200}
            style={{ borderRadius: '50%' }}
            src={`/캐릭터/${data.proposal.rightCharacterName}.webp`}
            alt="right-character"
          />
          <span>{data.proposal.rightCharacterName}</span>
        </div>
      </div>
      <Spacer v={2} />

      <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
        {/* left */}
        <div>
          <Card>
            <CardHeader>
              <Badge
                variant={data.proposal.status === 'rejected' ? 'destructive' : 'default'}
                className={data.proposal.status === 'active' ? 'bg-green-500 dark:bg-green-600' : ''}
              >
                {data.proposal.status}
              </Badge>
              <CardTitle>안건 제목: {data.proposal.title}</CardTitle>
              <CardDescription>안건 내용: {data.proposal.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              투표 기간: {data.proposal.startAt}~{data.proposal.endAt}
            </CardFooter>
          </Card>
        </div>

        {/* right */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>투표 현황</CardTitle>
              <CardDescription>투표 개요: Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
              <span style={{ fontWeight: 'bold' }}>투표자 리스트</span>
              <Spacer v={1} />
              {data.voteHistory.map((v, index) => {
                return (
                  <ul key={v.id}>
                    <li>참여 순서: {index + 1}</li>
                    <li>유저 아이디: {v.userId}</li>
                    <li>개표: {v.voteCast}</li>
                  </ul>
                );
              })}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="self-end">투표하기</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
