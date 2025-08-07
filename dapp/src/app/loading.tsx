import { LoadingSpinner } from '@/components/ui/spinner';
import React from 'react';

interface Props {}

export default function Loading({}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <LoadingSpinner size={72} />
    </div>
  );
}
