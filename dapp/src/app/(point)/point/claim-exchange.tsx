'use client';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { IVoter, PointClaimActionType } from '@/types/application';
import Image from 'next/image';
import { TypographyH1, TypographyH2, TypographyP } from '@/components/ui/typography';
import { Spacer } from '@/components/ui/spacer';
import { ArrowLeft, Move } from 'lucide-react';
import { POINT_RATE, PointClaimAction } from '@/constants/index';
import { useAuth } from '@/app/store';
import { LoginRequired } from '@/components/ui/intercept';
import { useMutator } from '@/lib/client';
import { Input } from '@/components/ui/input';
import Form from 'next/form';
import { exchangePointToElif } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { LoadingWrapper } from '@/components/ui/spinner';

interface Props {
  balanceOrMessage: string | Omit<IVoter, 'id'>;
}

export default function ClaimAndExchange({ balanceOrMessage }: Props) {
  const { auth } = useAuth();
  const [isCheekPullingDrag, setIsCheekPullingDrag] = useState(false);
  const [isHeadpatDrag, setIsHeadpatDrag] = useState(false);

  const [state, formAction, isPending] = useActionState(exchangePointToElif, undefined);
  const { pending } = useFormStatus();
  const [elifAmount, setElifAmount] = useState(0);
  const [pointToExchange, setPointToExchange] = useState(0);
  const router = useRouter();

  const requestPointForCheekPulling = async () => {
    alert('볼을 당기셨습니다');
    await useMutator({ endpoint: '/api/point', body: JSON.stringify({ action: PointClaimAction.CHEEKPULLING }) });
    alert(`${POINT_RATE.cheekpulling} 포인트를 획득했습니다.`);
    router.refresh();
  };

  const requestPointForHeadpat = async () => {
    alert('머리를 쓰다듬으셨습니다');
    await useMutator({ endpoint: '/api/point', body: JSON.stringify({ action: PointClaimAction.HEADPAT }) });
    alert(`${POINT_RATE.headpat} 포인트를 획득했습니다.`);
    router.refresh();
  };

  useEffect(() => {
    if (state === 'ok') alert(`${pointToExchange}포인트를 ${elifAmount}엘리프로 교환하셨습니다.`);
  }, [state]);

  return (
    <>
      <TypographyH1 text="월드컵 재화 얻기" />
      <p className="my-6 text-center">캐릭터의 볼을 당기거나 머리를 쓰다듬고 포인트를 획득하세요.</p>
      <p className="my-1 text-center">볼 당기기: {POINT_RATE.cheekpulling} point</p>
      <p className="my-1 text-center">머리 쓰다듬기: {POINT_RATE.headpat} point</p>

      <Spacer v={1.5} />

      {/* point claim */}
      <LoginRequired auth={auth} message="로그인하고 볼 당기기">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexFlow: 'row wrap',
            alignItems: 'flex-start',
            gap: '2rem',
          }}
        >
          <div>
            <TypographyP text="버터의 볼을 당긴다" />
            <InteractWithCharacter
              type={PointClaimAction.CHEEKPULLING}
              isDragging={isCheekPullingDrag}
              onDragStateChange={setIsCheekPullingDrag}
              onFinish={requestPointForCheekPulling}
            />
            <RenderReaction type={PointClaimAction.CHEEKPULLING} isDragging={isCheekPullingDrag} />
          </div>
          <div>
            <TypographyP text="버터의 머리를 쓰다듬는다" />
            <InteractWithCharacter
              type={PointClaimAction.HEADPAT}
              isDragging={isHeadpatDrag}
              onDragStateChange={setIsHeadpatDrag}
              onFinish={requestPointForHeadpat}
            />
            <RenderReaction type={PointClaimAction.HEADPAT} isDragging={isHeadpatDrag} />
          </div>
        </div>
      </LoginRequired>

      <Spacer v={1.5} />

      <TypographyH2 text="재화 교환하기" />
      <p className="my-6 text-center">
        획득한 포인트를 엘리프 토큰으로 교환하세요. <br /> 엘리프는 월드컵 투표권으로 사용됩니다.
      </p>
      <Image
        className="m-auto my-2 border-4 p-2 border-green-200 rounded-full"
        src={'/포인트/엘리프.webp'}
        width={75}
        height={75}
        alt="엘리프"
      />
      <p className="mt-5 mb-1 text-center">1 엘리프(Elif) = {POINT_RATE.elif} 포인트로 교환 가능합니다.</p>
      {typeof balanceOrMessage !== 'string' && (
        <>
          <div className="opacity-70 text-center">*{balanceOrMessage.nickname} 님의</div>
          <p className="opacity-70 text-center">현재 교환 가능한 포인트 수량: {balanceOrMessage.point}</p>
          <p className="opacity-70 text-center">현재 보유 엘리프 수량: {balanceOrMessage.elif}</p>
        </>
      )}
      <Spacer v={1} />

      {/* point exchange */}
      <LoginRequired auth={auth} message="로그인하고 교환하기">
        <Form action={formAction}>
          {isPending && <LoadingWrapper message="처리 중..." />}
          <Input
            onChange={(v) => {
              setPointToExchange(+v.currentTarget.value);
              setElifAmount(+v.currentTarget.value / POINT_RATE.elif);
            }}
            required
            className="w-full max-w-md m-auto"
            name="point"
            placeholder="포인트 수량을 입력하세요"
            type="number"
            max={typeof balanceOrMessage !== 'string' ? balanceOrMessage.point : 0}
          />
          <Input className="w-full max-w-md m-auto" name="elif" type="text" value={`${elifAmount} elif`} disabled />
          {state && state !== 'ok' && (
            <Alert className="w-full max-w-md m-auto" variant="destructive">
              <AlertTitle>포인트 교환에 실패하셨습니다.</AlertTitle>
              <AlertDescription>{state}</AlertDescription>
            </Alert>
          )}
          {state && state === 'ok' && (
            <Alert className="w-full max-w-md m-auto" variant="default">
              <AlertTitle>포인트를 성공적으로 교환했습니다.</AlertTitle>
              <AlertDescription>교환한 엘리프 수량: {elifAmount}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button type="submit" className="m-auto" disabled={pending ? true : false}>
              교환하기
            </Button>
          </div>
        </Form>
      </LoginRequired>
    </>
  );
}

/**
 *
 * @doc https://github.com/pmndrs/use-gesture?tab=readme-ov-file#simple-example
 */
function InteractWithCharacter({
  type,
  isDragging,
  onDragStateChange,
  onFinish,
}: {
  type: PointClaimActionType;
  isDragging: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onFinish: () => Promise<void>;
}) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const isDragDone = useRef<boolean>(null);

  // Set the drag hook and define component movement based on gesture data.
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    isDragDone.current = false;
    onDragStateChange(down);

    switch (type) {
      case 'cheekpulling':
        if (down) {
          api.start({ x: mx < 0 ? mx : 0, y: 0 });
        } else {
          api.start({
            x: 0,
            y: 0,
            onRest: async ({ value }) => {
              if (Math.abs(value.x) < 0.01 && !isDragDone.current) {
                isDragDone.current = true;
                await onFinish();
              }
            },
          });
        }
        break;

      case 'headpat':
        api.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          onRest: async (result) => {
            const { x, y } = result.value;
            if (!isDragDone.current && Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
              isDragDone.current = true;
              await onFinish();
            }
          },
        });
        break;

      default:
        break;
    }
  });

  // Bind it to a component.
  return (
    <>
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          touchAction: 'none',
          width: 50,
          height: 50,
          cursor: `url('/포인트/커서/${isDragging ? '드래그' : '기본'}.webp'), auto`,
          backgroundColor: 'wheat',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {type === PointClaimAction.CHEEKPULLING && <ArrowLeft color="black" />}
        {type === PointClaimAction.HEADPAT && <Move color="black" />}
      </animated.div>
    </>
  );
}

function RenderReaction({ type, isDragging }: { type: PointClaimActionType; isDragging: boolean }) {
  if (!isDragging) return <Image src={'/포인트/버터/기본.webp'} width={200} height={200} alt="기본" />;

  switch (type) {
    case 'cheekpulling':
      return <Image src={'/포인트/버터/볼당기기.webp'} width={200} height={200} alt="볼당기기" />;

    case 'headpat':
      return <Image src={'/포인트/버터/쓰다듬기.webp'} width={200} height={200} alt="쓰다듬기" />;

    default:
      <Image src={'/포인트/버터/기본.webp'} width={200} height={200} alt="기본" />;
  }
}
