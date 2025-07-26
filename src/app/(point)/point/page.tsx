'use client';
import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { PointClaimActionType } from '@/types/application';
import Image from 'next/image';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import { Spacer } from '@/components/ui/spacer';
import { ArrowDownUp, ArrowLeft, ArrowRightLeft, Move } from 'lucide-react';

interface Props {}

export default function PointPage({}: Props) {
  const [isHeadpatDrag, setIsHeadpatDrag] = useState(false);
  const [isCheekPullingDrag, setIsCheekPullingDrag] = useState(false);

  return (
    <>
      <TypographyH1 text="릭트컬 재화 얻기" />
      <TypographyP text="캐릭터의 볼을 당기거나 머리를 쓰다듬고 포인트를 획득하세요." align="text-left" />

      <Spacer v={1} />
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
          <InteractWithCharacter type="cheekpulling" onDragStateChange={setIsCheekPullingDrag} />
          <RenderReaction type="cheekpulling" isDragging={isCheekPullingDrag} />
        </div>
        <div>
          <TypographyP text="버터의 머리를 쓰다듬는다" />
          <InteractWithCharacter type="headpat" onDragStateChange={setIsHeadpatDrag} />
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
}: {
  type: PointClaimActionType;
  onDragStateChange: (isDragging: boolean) => void;
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
            onRest: ({ value }) => {
              if (Math.abs(value.x) < 0.01 && !isDragDone.current) {
                isDragDone.current = true;
                alert('볼을 당기셨습니다');
              }
            },
          });
        }
        break;

      case 'headpat':
        api.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          onRest: (result) => {
            const { x, y } = result.value;
            if (!isDragDone.current && Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
              isDragDone.current = true;
              alert('머리를 쓰다듬으셨습니다');
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
