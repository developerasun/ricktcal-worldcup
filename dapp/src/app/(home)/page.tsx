import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyH1 } from '@/components/ui/typography';
import RowOverview from './row-overview';
import { ProposalListType } from '@/types/application';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { COOKIE_NAME } from '@/constants/index';
import { LoginRequired } from '@/components/ui/intercept';

async function getProposalList() {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/proposal`, {
    cache: 'no-store', // @dev prevent calling fetch build-time
  });
  const raw = await response.json();

  return { raw };
}

export default async function Home() {
  const isLogin = (await cookies()).get(COOKIE_NAME.auth);
  const { raw } = await getProposalList();

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
    <main className="flex flex-col gap-[32px] row-start-2 items-center">
      <TypographyH1 text={'릭트컬 거버넌스'} />
      <p className="my-3 text-center m-auto">
        귀염 뽀짝! 뽈따구 라이프! <br /> 릭트컬 거버넌스에 참여하고 트릭컬 최애 사도를 뽑아봐요!
      </p>

      <div className="sm:self-end">
        {isLogin && (
          <Link href={'/proposal/new'}>
            <Button>투표 만들기</Button>
          </Link>
        )}
        {!isLogin && <LoginRequired message="로그인하고 투표 만들기" />}
      </div>
      <Table>
        <TableCaption>클릭 시 의제 개요 페이지로 이동합니다.</TableCaption>
        <TableHeader className="w-3/4 sm:w-auto">
          <TableRow>
            <TableHead className="w-[100px] text-center">의제</TableHead>
            <TableHead className="text-center">상태</TableHead>
            <TableHead className="text-center">개요</TableHead>
            <TableHead className="text-center">기간</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RowOverview data={data} />
        </TableBody>
      </Table>
    </main>
  );
}
