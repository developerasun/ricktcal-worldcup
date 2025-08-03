'use client';

import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { ProposalStatus } from '@/constants';
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
            현재 진행 중인 월드컵이 없습니다.
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
            <TableCell className="text-center">
              <Badge
                variant={d.status === ProposalStatus.FINISHED ? 'destructive' : 'default'}
                className={
                  d.status === ProposalStatus.ACTIVE
                    ? 'bg-green-500 dark:bg-green-600 text-white font-bold p-1.5 mb-1'
                    : 'font-bold p-1.5 mb-1'
                }
              >
                {d.status.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-center">{d.title}</TableCell>
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
