'use client';

import { createNewProposal, recoverAndSignIn } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacer } from '@/components/ui/spacer';
import { TypographyH1 } from '@/components/ui/typography';
import Form from 'next/form';
import React, { useActionState } from 'react';
import { shuffle } from 'es-toolkit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TRICKCAL_CHARACTERS } from '@/constants/nickname';

interface Props {}

export default function NewProposalPage({}: Props) {
  const [state, formAction] = useActionState(createNewProposal, undefined);

  return (
    <div>
      <TypographyH1 text={'신규 월드컵 만들기'} />
      <Spacer v={1.5} />
      <Form action={formAction}>
        <Input className="w-full max-w-md m-auto" name="title" placeholder="월드컵 제목을 입력하세요" type="text" />
        <Input
          className="w-full max-w-md m-auto"
          name="description"
          placeholder="월드컵 내용을 입력하세요"
          type="text"
        />
        <Input className="w-full max-w-md m-auto" name="startAt" placeholder="시작 날짜를 입력하세요" type="date" />
        <Input className="w-full max-w-md m-auto" name="endAt" placeholder="종료 날짜를 입력하세요" type="date" />

        <div className="flex items-center justify-center">
          <Select name="left-character">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="left-character" />
            </SelectTrigger>
            <SelectContent>
              {TRICKCAL_CHARACTERS.map((c, index) => (
                <SelectItem key={index} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="right-character">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="right-character" />
            </SelectTrigger>
            <SelectContent>
              {TRICKCAL_CHARACTERS.map((c, index) => (
                <SelectItem key={index} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Spacer v={1.5} />
        <div className="flex justify-end">
          <Button type="submit" className="m-auto">
            생성하기
          </Button>
        </div>
      </Form>
      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *2025년 7월 기준 3성 캐릭터만 선택 가능합니다.
      </p>
    </div>
  );
}
