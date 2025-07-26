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
          <TableRow
            className="text-center"
            key={d.id}
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`proposal/${d.id}`)}
          >
            <TableCell className="text-center">{d.title}</TableCell>
            <TableCell className="text-center">{d.status}</TableCell>
            <TableCell className="text-center">{d.description}</TableCell>
            <TableCell className="text-center">
              {d.startAt}~{d.endAt}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
