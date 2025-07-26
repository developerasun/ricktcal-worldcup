import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyH1 } from '@/components/ui/typography';
import RowOverview from './row-overview';
import { ProposalListType } from '@/types/application';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Home() {
  const isLogin = (await cookies()).get('ricktcal.session');

  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal`);
  const raw = await response.json();

  if (!raw)
    return (
      <Alert variant="destructive">
        <Siren />
        <AlertTitle>서버 에러</AlertTitle>
        <AlertDescription>현재 정상적으로 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.</AlertDescription>
      </Alert>
    );
  const data = raw as ProposalListType;

  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <TypographyH1 text={'릭트컬 거버넌스'} />
      <p className="my-3 text-center m-auto">
        귀염 뽀작 뽈따구 라이프! <br /> 릭트컬 거버넌스에 참여하고 트릭컬 최애 사도를 뽑아봐요!
      </p>
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

      {isLogin ? 'ee' : 'll'}
      <Link href="/login">
        <p>만들기</p>
      </Link>
    </main>
  );
}
