'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, ReactNode, useEffect, useActionState } from 'react';
import { Divide, Moon, Siren, Sun, Wallet } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IconCopy, IconGithub } from './icon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Form from 'next/form';
import { generateWallet } from '@/app/actions/index';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Spacer } from './spacer';
import { useCopyText } from '@/lib/client';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

export default function Navigation({ children }: Props) {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);
  const [state, formAction] = useActionState(generateWallet, undefined);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    isDark ? setTheme('dark') : setTheme('light');
  }, [isDark]);

  return (
    <nav className="min-h-screen flex flex-col">
      <div className="top-0 left-0 z-50 w-full flex justify-center items-center p-2">
        <Image
          style={{ cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => router.push('/')}
          width={100}
          height={100}
          src={'/브랜드/로고.webp'}
          alt="logo"
        />
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="m-auto">
            <TabsTrigger value="포인트" onClick={() => router.push('/point')}>
              포인트
            </TabsTrigger>
            <TabsTrigger value="월드컵" onClick={() => router.push('/')}>
              월드컵
            </TabsTrigger>
            <TabsTrigger value="투표자" onClick={() => router.push('/voter')}>
              투표자
            </TabsTrigger>
            <TabsTrigger value="개발자도구" onClick={() => router.push('/apidoc')}>
              개발자도구
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
        <Dialog>
          <DialogTrigger className="border border-gray-600 rounded-sm p-2">
            <Wallet className="h-[1rem] w-[1rem]" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>시작하기</DialogTitle>
              <DialogDescription>
                포인트를 엘리프 토큰으로 교환하고, <br /> 나만의 최애 사도에게 투표하세요!
              </DialogDescription>
            </DialogHeader>
            <Form action={formAction}>
              {state && (
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-2">
                    <p>지갑 주소</p>
                    <IconCopy
                      className="cursor-pointer"
                      onClick={async () => {
                        await useCopyText({ text: state.address.toString() });
                        alert('지갑 주소가 복사되었습니다.');
                      }}
                    />
                  </div>
                  <p className="my-2 break-all whitespace-normal w-full">{state.address.toString()}</p>
                </div>
              )}

              <Spacer v={1} />

              {state && state.mnemonic && (
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-2">
                    <p>지갑 패스키</p>
                    <IconCopy
                      className="cursor-pointer"
                      onClick={async () => {
                        await useCopyText({ text: state.mnemonic! });
                        alert('패스키가 복사되었습니다.');
                      }}
                    />
                  </div>
                  <p className="my-2 break-all whitespace-normal w-full">{state.mnemonic}</p>
                </div>
              )}
              <Spacer v={1.5} />
              {state && (
                <Alert variant="destructive">
                  <Siren />
                  <AlertTitle>경고</AlertTitle>
                  <AlertDescription>
                    생성된 지갑은 테스트넷 전용으로만 사용하고, 지갑 패스키를 타인과 공유하지 마십시오. 패스키 정보는
                    모달을 닫으면 다시 볼 수 없습니다.
                  </AlertDescription>
                </Alert>
              )}
              <Spacer v={1.5} />
              <div className="flex justify-end">
                {state && (
                  <DialogClose asChild className="m-auto">
                    <Link href={'/login'} className="p-3 m-auto border border-blue-300 rounded-md">
                      로그인하기
                    </Link>
                  </DialogClose>
                )}
                {!state && (
                  <Button type="submit" className="m-auto">
                    패스키 생성하기
                  </Button>
                )}
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* prettier-ignore */}
      {/* @dev flex-1 for claiming extra room for children */}
      <div className="flex-1 w-3/4 sm:w-2/4 m-auto">{children}</div>

      <footer className="bottom-0 left-0 w-full flex gap-[24px] flex-wrap items-center justify-center p-4 border-t">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/developerasun/ricktcal-worldcup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconGithub />
        </a>
      </footer>
    </nav>
  );
}
