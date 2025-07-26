'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { ProposalListType } from '@/types/application';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  data: ProposalListType;
}

export default function RowOverview({ data }: Props) {
  const router = useRouter();
  return (
    <>
      {data.length === 0 && (
        <TableRow style={{ cursor: 'pointer' }} onClick={() => router.push('/proposal/1')}>
          <TableCell colSpan={4} className="font-medium text-center">
            현재 진행 중인 의제가 없습니다.
          </TableCell>
        </TableRow>
      )}
      {data.map((d) => {
        return (
          <>
            <TableRow style={{ cursor: 'pointer' }} onClick={() => router.push('/proposal/1')}>
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell>{d.status}</TableCell>
              <TableCell>{d.description}</TableCell>
              <TableCell className="text-right">
                {d.startAt}~{d.endAt}
              </TableCell>
            </TableRow>
          </>
        );
      })}
    </>
  );
}
