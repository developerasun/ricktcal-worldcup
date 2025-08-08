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
import { POINT_RATE, ProposalStatus } from '@/constants';
import Link from 'next/link';
import { IconDown, IconExternalLink } from '@/components/ui/icon';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { AlertEmpty } from '@/components/ui/alert';
import { josa } from 'es-hangul';

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
  const votingPowerDifference = Math.abs(data.proposal.leftCharacterElif - data.proposal.rightCharacterElif).toFixed(2);

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
          {/* voting overview */}
          <Card className="mb-4">
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
              <CardTitle>월드컵 제목: {data.proposal.title}</CardTitle>
              <CardDescription>월드컵 내용: {data.proposal.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              투표 기간: {data.proposal.startAt}~{data.proposal.endAt}
            </CardFooter>
          </Card>

          {/* voting status */}
          <Card>
            <CardHeader>
              <CardTitle>투표 현황</CardTitle>
              <CardDescription>현재 월드컵에 대한 주요 정보를 수치화해서 보여드립니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="font-semibold pb-1">{data.proposal.leftCharacterName} 의 개표 현황</div>
                <ol className="border border-gray-300 p-2 rounded-sm">
                  <li>
                    총 득표 수: {data.voteHistory.filter((v) => v.voteCast === data.proposal.leftCharacterName).length}
                  </li>
                  <li>엘리프 투표권 수: {data.proposal.leftCharacterElif} 엘리프</li>
                </ol>
              </div>

              <div className="flex-1">
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
                      *[개표 중]: {josa(leadingCharacter, '이/가')} {votingPowerDifference} 엘리프만큼 우세합니다.
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
                      *[개표 완료]: {josa(leadingCharacter, '이/가')} {votingPowerDifference} 엘리프 차이로
                      승리했습니다.
                    </p>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* right */}
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>투표자 리스트</CardTitle>
              <CardDescription>현재 월드컵에 참여하신 교주님들에 대한 목록을 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-scroll">
                {data.voteHistory.length === 0 && <AlertEmpty message="현재 참여 중인 교주님이 없습니다." />}
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
          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
              <CardDescription>교주님들이 질문해주신 월드컵 관련 문의 목록을 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Accordion type="single" collapsible className="flex flex-col gap-4">
                <AccordionItem value="item-1" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>엘리프가 없어요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    엘리프는 포인트와 교환이 가능합니다. 교환 비율은 1 엘리프 : {POINT_RATE.elif} 포인트 비율로
                    교환됩니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>포인트가 없어요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    포인트는 사도와의 상호 작용을 통하여 획득하실 수 있습니다. 사도의 볼을 잡아당기거나 머리를 쓰다듬고
                    포인트를 획득하세요.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>전자 서명이 뭔가요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    교주님의 투표 선택에 대해 위/변조 방지를 위해 암호화처리 하는 과정입니다. 전자 서명이 성공적으로
                    완료되면, 서명이 서버로 전송됩니다. <br /> 서명은 스마트 컨트랙트를 통해 블록체인에 저장되어
                    공개적으로 열람이 가능해집니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>투표를 잘못했어요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    한번 참여한 월드컵에는 투표 이후 재투표가 불가능합니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>가스비는 누가 내나요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    서버에서 냅니다. 교주님들은 가스비를 따로 지불하지 않습니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="p-2 border-y-1">
                  <AccordionTrigger className="cursor-pointer w-full flex justify-between gap-2">
                    <span>결과는 언제 나오나요</span>
                    <IconDown className="w-5 h-5" />
                  </AccordionTrigger>
                  <AccordionContent className="mt-3 opacity-70">
                    월드컵 종료일 기준 서버에서 3시간 간격으로 종료 유무를 체크합니다. e.g 2025년 8월 5일 종료시 2025년
                    8월 5일 자정부터 3시간 간격으로 월드컵이 종료됩니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
