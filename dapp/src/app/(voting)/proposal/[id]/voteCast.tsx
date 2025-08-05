'use client';

import { createNewVoteWithSignature, createVotingTransaction } from '@/app/actions';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Form from 'next/form';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { TypographyH2, TypographyH3 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { useAuth } from '@/app/store';
import { LoginRequired } from '@/components/ui/intercept';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  castList: string[];
}

export default function VoteCastModal({ castList }: Props) {
  const [signState, signAction] = useActionState(createNewVoteWithSignature, undefined);
  const [voteState, voteAction] = useActionState(createVotingTransaction, undefined);

  const { pending } = useFormStatus();
  const { auth } = useAuth();
  const { id: proposalId } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (voteState) {
      if (voteState === 'ok') {
        toast.success('성공적으로 거버넌스 안건에 참여하셨습니다.');
        router.refresh();
      } else toast.error(voteState, { style: { color: 'red' } });
    }
  }, [voteState]);

  return (
    <>
      <Form action={signAction} className="flex flex-col">
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
        <Input
          className="w-full max-w-md m-auto"
          name="elif-voting-power"
          placeholder="엘리프 투표권 수량을 입력하세요"
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
        {signState && (
          <div className="p-6 border border-gray-300 rounded-md">
            <TypographyH2 text="전자 영수증" />
            <ol className="flex flex-col gap-1 text-left">
              <li>요청자: {signState.payload.issuer}</li>
              <li>서명자: {signState.payload.signer?.toString()}</li>
              <li>URL: {signState.payload.url}</li>
              <li>네트워크: {signState.payload.network}</li>
              <li>버전: {signState.payload.version}</li>
              <li>체인 ID: {signState.payload.chainId}</li>
              <li>논스: {signState.payload.nonce}</li>
              <li>서명 일자: {signState.payload.timestamp}</li>
              <li>투표 내용: {signState.payload.voteCast}</li>
              <li>엘리프 투표권 수량: {signState.payload.votingPower}</li>
            </ol>
            <Spacer v={1.5} />
            <TypographyH3 text="전자 서명" />
            <p className="text-left break-all whitespace-normal w-full">{signState.signature}</p>
          </div>
        )}
      </Form>

      {signState && (
        <Form action={voteAction} className="flex flex-col">
          <Spacer v={1} />
          <DialogFooter>
            <input type="hidden" name="vote-cast-hidden" value={signState.payload.voteCast} />
            <input type="hidden" name="proposal-id-hidden" value={proposalId} />
            <input type="hidden" name="elif-voting-power-hidden" value={signState.payload.votingPower} />
            <input type="hidden" name="signature-hidden" value={signState.signature} />
            <DialogClose asChild>
              <Button variant="outline">취소하기</Button>
            </DialogClose>
            {voteState === 'ok' && (
              <DialogClose asChild>
                <Button variant="ghost">나가기</Button>
              </DialogClose>
            )}
            {voteState !== 'ok' && <Button type="submit">투표하기</Button>}
          </DialogFooter>
        </Form>
      )}
    </>
  );
}
