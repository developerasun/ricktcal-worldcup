'use client';

import { createNewProposal, recoverAndSignIn } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacer } from '@/components/ui/spacer';
import { TypographyH1 } from '@/components/ui/typography';
import Form from 'next/form';
import React, { useActionState } from 'react';
import { shuffle } from 'es-toolkit';

interface Props {}

export default function NewProposalPage({}: Props) {
  const [state, formAction] = useActionState(createNewProposal, undefined);

  return (
    <div>
      <TypographyH1 text={'신규 월드컵 만들기'} />
      <Spacer v={1.5} />
      <Form action={formAction}>
        <Input className="w-full max-w-md m-auto" name="title" placeholder="패스키를 입력하세요" type="text" />
        <Input className="w-full max-w-md m-auto" name="description" placeholder="패스키를 입력하세요" type="text" />
        <Input className="w-full max-w-md m-auto" name="startAt" placeholder="시작 날짜를 입력하세요" type="date" />
        <Input className="w-full max-w-md m-auto" name="endAt" placeholder="종료 날짜를 입력하세요" type="date" />
        <Spacer v={1.5} />
        <div className="flex justify-end">
          <Button type="submit" className="m-auto">
            생성하기
          </Button>
        </div>
      </Form>
      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *패스키가 없을 경우, <br />
        우측 상단 지갑 아이콘을 눌러 패스키를 생성하세요
      </p>
    </div>
  );
}
