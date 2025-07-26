import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import RowOverview from './row-overview';
import { ProposalListType } from '@/types/application';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Divide, Siren } from 'lucide-react';

export default async function Home() {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal`);
  const raw = await response.json();

  if (!raw)
    return (
      <Alert variant="destructive">
        <Siren />
        <AlertTitle>서버 에러</AlertTitle>
        <AlertDescription>현재는 정상적으로 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.</AlertDescription>
      </Alert>
    );
  const data = raw as ProposalListType;

  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <TypographyH1 text={'거버넌스 의제'} />
      <TypographyP text={'Lorem ipsum dolor sit amet.'} />
      {JSON.stringify(data)}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">의제</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>개요</TableHead>
            <TableHead className="text-right">기간</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RowOverview data={data} />
        </TableBody>
      </Table>
    </main>
  );
}
