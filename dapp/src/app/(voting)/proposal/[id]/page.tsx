import { TypographyH1 } from '@/components/ui/typography';
import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ProposalListType } from '@/types/application';
import { notFound } from 'next/navigation';
import { Spacer } from '@/components/ui/spacer';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProposalDetail({ id }: { id: number }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal`);
  const data = (await response.json()) as ProposalListType;
  return data.find((d) => d.id === id);
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const data = await getProposalDetail({ id: +id });

  if (!data) return notFound();

  return (
    <>
      <TypographyH1 text={`거버넌스 안건 #${data.id}`} />

      <Spacer v={2} />
      <div className="flex justify-center items-center gap-2">
        <Image
          width={200}
          height={200}
          style={{ borderRadius: '50%' }}
          src={`/캐릭터/${data.leftCharacterName}.webp`}
          alt="left-character"
        />
        <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>VS</p>
        <Image
          width={200}
          height={200}
          style={{ borderRadius: '50%' }}
          src={`/캐릭터/${data.rightCharacterName}.webp`}
          alt="right-character"
        />
      </div>
      <Spacer v={2} />

      <Card>
        <CardHeader>
          <Badge
            variant={data.status === 'rejected' ? 'destructive' : 'default'}
            className={data.status === 'active' ? 'bg-green-500 dark:bg-green-600' : ''}
          >
            {data.status}
          </Badge>
          <CardTitle>안건 제목: {data.title}</CardTitle>
          <CardDescription>안건 내용: {data.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          투표 기간: {data.startAt}~{data.endAt}
        </CardFooter>
      </Card>
    </>
  );
}
