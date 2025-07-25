'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface Props {}

export default function PointPage({}: Props) {
  return (
    <div>
      캐릭터의 볼을 당기거나 머리를 쓰다듬고 포인트를 획득하세요.
      <InteractWithCharacter type="cheekpulling" />
      asdf
      <InteractWithCharacter type="headpat" />
    </div>
  );
}

/**
 *
 * @doc https://github.com/pmndrs/use-gesture?tab=readme-ov-file#simple-example
 */
function InteractWithCharacter({ type }: { type: 'headpat' | 'cheekpulling' }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const isDragDone = useRef<boolean>(null);

  // Set the drag hook and define component movement based on gesture data.
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    isDragDone.current = false;

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
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: 'none', width: 100, height: 100, backgroundColor: 'red', borderRadius: '50%' }}
    />
  );
}
