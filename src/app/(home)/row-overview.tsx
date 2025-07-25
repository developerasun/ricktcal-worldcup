'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {}

export default function RowOverview({}: Props) {
  const router = useRouter();
  return (
    <>
      <TableRow style={{ cursor: 'pointer' }} onClick={() => router.push('/proposal/1')}>
        <TableCell className="font-medium">INV001</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell>Credit Card</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
    </>
  );
}
