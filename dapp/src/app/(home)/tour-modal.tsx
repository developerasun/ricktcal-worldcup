'use client';

import { Button } from '@/components/ui/button';
import { useTour } from '@reactour/tour';
import React from 'react';

interface Props {}

export default function TourModalAction({}: Props) {
  const { setIsOpen } = useTour();
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>투어하기</Button>
    </div>
  );
}
