'use client';
import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { PointClaimActionType } from '@/types/application';
import Image from 'next/image';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import { Spacer } from '@/components/ui/spacer';
import { ArrowLeft, Move } from 'lucide-react';
import { POINT_RATE } from '@/constants/point';

interface Props {}

export default function PointPage({}: Props) {
  const [isHeadpatDrag, setIsHeadpatDrag] = useState(false);
  const [isCheekPullingDrag, setIsCheekPullingDrag] = useState(false);
  const requestPointForCheekPulling = async () => {
    alert('볼을 당기셨습니다');
    await fetch('/api/point', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ action: 'cheekpulling' }),
      credentials: 'include',
    });
    alert(`${POINT_RATE.cheekpulling} 포인트를 획득했습니다.`);
  };

  const requestPointForHeadpat = async () => {
    alert('머리를 쓰다듬으셨습니다');
    await fetch('/api/point', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ action: 'headpat' }),
      credentials: 'include',
    });
    alert(`${POINT_RATE.headpat} 포인트를 획득했습니다.`);
  };

  return (
    <>
      <TypographyH1 text="릭트컬 재화 얻기" />
      <p className="my-6 text-center">캐릭터의 볼을 당기거나 머리를 쓰다듬고 포인트를 획득하세요.</p>
      <p className="my-1 text-center">볼 당기기: 10 point</p>
      <p className="my-1 text-center">머리 쓰다듬기: 5 point</p>

      <Spacer v={1.5} />
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
            type="cheekpulling"
            onDragStateChange={setIsCheekPullingDrag}
            onFinish={requestPointForCheekPulling}
          />
          <RenderReaction type="cheekpulling" isDragging={isCheekPullingDrag} />
        </div>
        <div>
          <TypographyP text="버터의 머리를 쓰다듬는다" />
          <InteractWithCharacter
            type="headpat"
            onDragStateChange={setIsHeadpatDrag}
            onFinish={requestPointForHeadpat}
          />
          <RenderReaction type="headpat" isDragging={isHeadpatDrag} />
        </div>
      </div>
    </>
  );
}

/**
 *
 * @doc https://github.com/pmndrs/use-gesture?tab=readme-ov-file#simple-example
 */
function InteractWithCharacter({
  type,
  onDragStateChange,
  onFinish,
}: {
  type: PointClaimActionType;
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
          cursor: 'pointer',
          backgroundColor: 'red',
          borderRadius: '50%',
        }}
      >
        {type === 'cheekpulling' && <ArrowLeft />}
        {type === 'headpat' && <Move />}
      </animated.div>
    </>
  );
}

function RenderReaction({ type, isDragging }: { type: PointClaimActionType; isDragging: boolean }) {
  if (!isDragging) return <Image src={'/포인트/기본.webp'} width={200} height={200} alt="기본" />;

  switch (type) {
    case 'cheekpulling':
      return <Image src={'/포인트/볼당기기.webp'} width={200} height={200} alt="볼당기기" />;

    case 'headpat':
      return <Image src={'/포인트/쓰다듬기.webp'} width={200} height={200} alt="쓰다듬기" />;

    default:
      <Image src={'/포인트/기본.webp'} width={200} height={200} alt="기본" />;
  }
}
