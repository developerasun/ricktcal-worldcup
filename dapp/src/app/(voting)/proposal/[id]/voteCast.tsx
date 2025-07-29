'use client';

import { createNewVoteWithSignature } from '@/app/actions';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Form from 'next/form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { TypographyH2, TypographyH3 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { useAuth } from '@/app/store';
import { LoginRequired } from '@/components/ui/intercept';

interface Props {
  castList: string[];
}

export default function VoteCastModal({ castList }: Props) {
  const [state, formAction] = useActionState(createNewVoteWithSignature, undefined);
  const { pending } = useFormStatus();
  const { auth } = useAuth();

  const requestVote = async () => {
    alert('준비중입니다.');
  };

  return (
    <>
      <Form action={formAction} className="flex flex-col">
        <RadioGroup name="vote-cast" defaultValue={castList[0]} required>
          {castList.map((c, index) => {
            return (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={c} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{c}</Label>
              </div>
            );
          })}
        </RadioGroup>
        <Spacer v={0.5} />
        <Input
          className="w-full max-w-md m-auto"
          name="mnemonic"
          placeholder="지갑 패스키를 입력하세요"
          type="text"
          required
        />
        <Spacer v={0.5} />
        {pending && <Loading />}
        {auth ? (
          <Button type="submit" className="self-end">
            서명 생성하기
          </Button>
        ) : (
          <LoginRequired>
            <Button type="submit" className="self-end">
              서명 생성하기
            </Button>
          </LoginRequired>
        )}

        <Spacer v={1} />
        {state && (
          <div className="p-6 border border-gray-300 rounded-md">
            <TypographyH2 text="전자 영수증" />
            <ol className="flex flex-col gap-1 text-left">
              <li>요청자: {state.payload.issuer}</li>
              <li>서명자: {state.payload.signer?.toString()}</li>
              <li>URL: {state.payload.url}</li>
              <li>네트워크: {state.payload.network}</li>
              <li>버전: {state.payload.version}</li>
              <li>체인 ID: {state.payload.chainId}</li>
              <li>논스: {state.payload.nonce}</li>
              <li>서명 일자: {state.payload.timestamp}</li>
              <li>투표 내용: {state.payload.voteCast}</li>
            </ol>
            <Spacer v={1.5} />
            <TypographyH3 text="전자 서명" />
            <p className="text-left break-all whitespace-normal w-full">{state.signature}</p>

            <Spacer v={1} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소하기</Button>
              </DialogClose>
              <Button type="button" onClick={requestVote}>
                투표하기
              </Button>
            </DialogFooter>
          </div>
        )}
      </Form>
    </>
  );
}
