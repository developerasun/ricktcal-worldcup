import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import RowOverview from './row-overview';
import { ProposalListType } from '@/types/application';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { COOKIE_NAME } from '@/constants/index';
import { LoginRequired } from '@/components/ui/intercept';
import Image from 'next/image';
import FaqList from './faq';

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
      <TypographyH1 text={'최애 사도 월드컵'} />
      <Image
        width={400}
        height={400}
        style={{ backgroundColor: 'transparent' }}
        src={`/브랜드/대문.webp`}
        alt="greeting-banner"
      />
      <p className="my-3 text-center m-auto">
        귀염 뽀짝! 뽈따구 라이프! <br /> 릭트컬 거버넌스에 참여하고 트릭컬 최애 사도를 뽑아봐요!
      </p>
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-center text-lg font-bold">제 0회 월드컵: 당신은 물에 빠졌습니다</h2>
        <p className="text-center">저런, 안타깝네요. 누구에게 도움을 요청하시겠습니까?</p>
        <div className="flex justify-center flex-nowrap gap-4">
          <div className="flex flex-col items-center w-40">
            <div className="relative w-full aspect-[2/3]">
              <Image src="/월드컵/영춘(좌).gif" alt="월드컵" fill className="object-cover rounded" />
            </div>
            <p className="text-center mt-2">껌딱지(영춘)을/를 믿는다</p>
          </div>
          <p className="font-bold self-center">VS</p>
          <div className="flex flex-col items-center w-40">
            <div className="relative w-full aspect-[2/3]">
              <Image src="/월드컵/크레페(우).gif" alt="월드컵" fill className="object-cover rounded" />
            </div>
            <p className="text-center mt-2">메이드(크레페)를 믿는다</p>
          </div>
        </div>

        {isLogin ? (
          <Link href="/proposal/new">
            <Button className="cursor-pointer">나도 월드컵 만들기</Button>
          </Link>
        ) : (
          <LoginRequired message="로그인하고 나도 월드컵 만들기" />
        )}
      </div>

      <TypographyH2 text={'월드컵 목록'} />
      <Table>
        <TableCaption>클릭 시 월드컵 개요 페이지로 이동합니다.</TableCaption>
        <TableHeader className="w-3/4 sm:w-auto">
          <TableRow>
            <TableHead className="text-center">진행 상태</TableHead>
            <TableHead className="w-[100px] text-center">월드컵</TableHead>
            <TableHead className="text-center">개요</TableHead>
            <TableHead className="text-center">기간</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RowOverview data={data} />
        </TableBody>
      </Table>
      {/* <FaqList /> */}
    </main>
  );
}
