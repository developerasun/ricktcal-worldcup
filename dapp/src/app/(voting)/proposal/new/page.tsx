'use client';

import { createNewProposal, recoverAndSignIn } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacer } from '@/components/ui/spacer';
import { TypographyH1 } from '@/components/ui/typography';
import Form from 'next/form';
import React, { useActionState, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TRICKCAL_CHARACTERS } from '@/constants/index';
import { useFromUtc } from '@/lib/client';
import Image from 'next/image';
import { VoteCastType } from '@/types/application';

interface Props {}

export default function NewProposalPage({}: Props) {
  const [state, formAction] = useActionState(createNewProposal, undefined);
  const [leftCharacter, setLeftCharacter] = useState<VoteCastType>('버터');
  const [rightCharacter, setRightCharacter] = useState<VoteCastType>('코미');

  const setStartDateLimit = () => {
    const { short } = useFromUtc();
    return short; // "YYYY-MM-DD"
  };

  const setEndDateLimit = () => {
    const { kstDate } = useFromUtc();
    kstDate.setDate(kstDate.getDate() + 6);
    return kstDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  return (
    <div>
      <TypographyH1 text={'신규 월드컵 만들기'} />
      <Spacer v={1.5} />
      <div className="flex justify-center gap-4">
        <Image width={200} height={300} src={`/캐릭터/${leftCharacter}.webp`} alt="월드컵" />
        <p className="font-bold self-center">VS</p>
        <Image width={200} height={300} src={`/캐릭터/${rightCharacter}.webp`} alt="월드컵" />
      </div>
      <Spacer v={1.5} />
      <Form action={formAction} className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <Select name="left-character" onValueChange={(v) => setLeftCharacter(v as VoteCastType)}>
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
          <Select name="right-character" onValueChange={(v) => setRightCharacter(v as VoteCastType)}>
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
        <Input className="w-full max-w-md m-auto" name="title" placeholder="월드컵 제목을 입력하세요" type="text" />
        <Input
          className="w-full max-w-md m-auto"
          name="description"
          placeholder="월드컵 내용을 입력하세요"
          type="text"
        />
        <Input
          className="w-full max-w-md m-auto"
          name="startAt"
          min={setStartDateLimit()}
          max={setEndDateLimit()}
          placeholder="시작 날짜를 입력하세요"
          type="date"
        />
        <Input
          className="w-full max-w-md m-auto"
          name="endAt"
          min={setStartDateLimit()}
          max={setEndDateLimit()}
          placeholder="종료 날짜를 입력하세요"
          type="date"
        />

        <div className="flex justify-end">
          <Button type="submit" className="m-auto">
            생성하기
          </Button>
        </div>
      </Form>

      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *2025년 8월 기준 3성 캐릭터만 선택 가능합니다.
      </p>
      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *생성된 월드컵은 한국 시간(KST) 기준입니다.
      </p>
      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *생성된 월드컵은 시작일 기준 자동으로 시작됩니다. <br />
        서버에서 3시간 간격으로 시작 유무를 체크합니다.
      </p>
      <p style={{ opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
        *생성된 월드컵은 종료일 기준 자동으로 종료됩니다. <br />
        서버에서 3시간 간격으로 종료 유무를 체크합니다.
      </p>
    </div>
  );
}
