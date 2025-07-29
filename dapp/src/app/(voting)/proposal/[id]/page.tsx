import { TypographyH1 } from '@/components/ui/typography';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { IProposal, VoteListType } from '@/types/application';
import { notFound } from 'next/navigation';
import { Spacer } from '@/components/ui/spacer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import VoteCastForm from './voteCast';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProposalDetail({ id }: { id: number }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal/${id}`);
  const data = (await response.json()) as { proposal: IProposal; voteHistory: VoteListType };

  return data;
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const data = await getProposalDetail({ id: +id });

  if (!data) return notFound();

  const VOTE_CAST_LIST = [data.proposal.leftCharacterName, data.proposal.rightCharacterName];

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
              <CardDescription>현재 진행 중인 안건에 대한 주요 정보를 수치화해서 보여드립니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>투표자 리스트</div>
                <ol className="border border-gray-300 p-2 rounded-sm">
                  <li>총 개표 수: {data.voteHistory.length}</li>
                  <li>
                    {data.proposal.leftCharacterName}의 득표 수:{' '}
                    {data.voteHistory.filter((v) => v.voteCast === data.proposal.leftCharacterName).length}
                  </li>
                  <li>
                    {data.proposal.rightCharacterName}의 득표 수:{' '}
                    {data.voteHistory.filter((v) => v.voteCast === data.proposal.rightCharacterName).length}
                  </li>
                </ol>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>투표자 리스트</div>
                {/* <Spacer v={1} /> */}
                {data.voteHistory.map((v, index) => {
                  return (
                    <ul key={v.id} className="border border-gray-300 p-2 rounded-sm">
                      <li>참여 순서: {index + 1}</li>
                      <li>유저 아이디: {v.userId}</li>
                      <li>개표: {v.voteCast}</li>
                    </ul>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Dialog>
                <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md transition font-bold">
                  지갑으로 투표하기
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center">전자 서명 요청</DialogTitle>
                    <DialogDescription className="text-center">
                      교주님이 이 지갑을 소유하고 있음을 확인하기 위해 <br />
                      패스키를 사용하여 전자 서명을 생성합니다.
                    </DialogDescription>
                    <VoteCastForm castList={VOTE_CAST_LIST} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
