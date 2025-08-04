import { TypographyH1 } from '@/components/ui/typography';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { IProposal, IVoter, VoteListType } from '@/types/application';
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
import { ProposalStatus } from '@/constants';
import Link from 'next/link';
import { IconExternalLink } from '@/components/ui/icon';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProposalDetail({ id }: { id: number }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal/${id}`);
  const _data = (await response.json()) as {
    proposal: IProposal;
    voteHistory: VoteListType;
    wallets: Record<number, { nickname: string; wallet: string }>;
  };

  const data = {
    ..._data,
    wallets: new Map(Object.entries(_data.wallets)), // reserialize Map
  };

  return data;
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const data = await getProposalDetail({ id: +id });

  if (!data) return notFound();

  const VOTE_CAST_LIST = [data.proposal.leftCharacterName, data.proposal.rightCharacterName];
  const isTied = data.proposal.leftCharacterElif === data.proposal.rightCharacterElif;
  const leadingCharacter =
    data.proposal.leftCharacterElif > data.proposal.rightCharacterElif
      ? data.proposal.leftCharacterName
      : data.proposal.rightCharacterName;
  const votingPowerDifference = Math.abs(data.proposal.leftCharacterElif - data.proposal.rightCharacterElif);

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
                variant={data.proposal.status === ProposalStatus.FINISHED ? 'destructive' : 'default'}
                className={
                  data.proposal.status === ProposalStatus.ACTIVE
                    ? 'bg-green-500 dark:bg-green-600 text-white font-bold p-1.5 mb-1'
                    : 'font-bold p-1.5 mb-1'
                }
              >
                {data.proposal.status.toUpperCase()}
              </Badge>
              <CardTitle>안건 제목: {data.proposal.title}</CardTitle>
              <CardDescription>안건 내용: {data.proposal.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              투표 기간: {data.proposal.startAt}~{data.proposal.endAt}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>투표 현황</CardTitle>
              <CardDescription>현재 월드컵에 대한 주요 정보를 수치화해서 보여드립니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <div className="font-semibold pb-1">{data.proposal.leftCharacterName} 의 개표 현황</div>
                <ol className="border border-gray-300 p-2 rounded-sm">
                  <li>
                    총 득표 수: {data.voteHistory.filter((v) => v.voteCast === data.proposal.leftCharacterName).length}
                  </li>
                  <li>엘리프 투표권 수: {data.proposal.leftCharacterElif} 엘리프</li>
                </ol>
              </div>

              <div>
                <div className="font-semibold pb-1">{data.proposal.rightCharacterName} 의 개표 현황</div>
                <ol className="border border-gray-300 p-2 rounded-sm">
                  <li>
                    총 득표 수: {data.voteHistory.filter((v) => v.voteCast === data.proposal.rightCharacterName).length}
                  </li>
                  <li>엘리프 투표권 수: {data.proposal.rightCharacterElif} 엘리프</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="font-semibold text-lg">월드컵 결과</div>
              <p>총 투표 수: {data.voteHistory.length}</p>
              <div>
                {isTied && `현재 양쪽 사도 모두 동일한 득표를 기록 중입니다.`}
                {data.proposal.status === ProposalStatus.ACTIVE && !isTied && (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <div style={{ transform: 'translate(0, -11%)' }}>
                      <Image
                        width={50}
                        height={50}
                        style={{ borderRadius: '50%', transform: 'translate(-15px, 40px)' }}
                        src={`/브랜드/우세.webp`}
                        alt="leading"
                      />
                      <Image
                        width={100}
                        height={100}
                        style={{ borderRadius: '50%' }}
                        src={`/캐릭터/${leadingCharacter}.webp`}
                        alt="lead-character"
                      />
                    </div>
                    <p className="opacity-70">
                      *[개표 중]: {leadingCharacter}가 {votingPowerDifference} 엘리프만큼 우세합니다.
                    </p>
                  </div>
                )}
                {data.proposal.status === ProposalStatus.FINISHED && !isTied && (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <div style={{ transform: 'translate(0, -11%)' }}>
                      <Image
                        width={40}
                        height={40}
                        style={{ transform: 'translate(-8px, 35px)' }}
                        src={`/브랜드/승리.webp`}
                        alt="leading"
                      />
                      <Image
                        width={100}
                        height={100}
                        style={{ borderRadius: '50%' }}
                        src={`/캐릭터/${leadingCharacter}.webp`}
                        alt="lead-character"
                      />
                    </div>
                    <p className="opacity-70">
                      *[개표 완료]: {leadingCharacter}가 {votingPowerDifference} 엘리프 차이로 승리했습니다.
                    </p>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* right */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>투표자 리스트</CardTitle>
              <CardDescription>현재 월드컵에 참여하신 교주님들에 대한 목록을 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-scroll">
                {data.voteHistory.map((v, index) => {
                  return (
                    <ul key={v.id} className="flex flex-col gap-1 border border-gray-300 p-4 rounded-sm">
                      <Link href={`/voter/${v.userId}`}>
                        <li>
                          <u className="flex justify-center items-center gap-2">
                            <Image
                              style={{ borderRadius: '50%' }}
                              width={50}
                              height={50}
                              src="/캐릭터/버터.webp"
                              alt="아바타"
                            />
                            <span>{data.wallets.get(`${v.userId}`)?.nickname}</span> <IconExternalLink />
                          </u>
                        </li>
                      </Link>
                      <li className="mt-1">개표: {v.voteCast}</li>
                      <li>개표량: {v.elifAmount} 엘리프</li>
                    </ul>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Dialog>
                <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md transition font-bold">
                  나도 투표하기
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
