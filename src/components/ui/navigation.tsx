'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, ReactNode, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IconGithub } from './icon';

interface Props {
  children: ReactNode;
}

export default function Navigation({ children }: Props) {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  const router = useRouter();
  useEffect(() => {
    isDark ? setTheme('dark') : setTheme('light');
  }, [isDark]);

  return (
    <>
      <div className="top-0 w-full flex justify-center items-center p-4">
        <Image width={100} height={100} src={'/브랜드/로고.webp'} alt="logo" />
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="m-auto">
            <TabsTrigger value="포인트" onClick={() => router.push('/point')}>
              포인트
            </TabsTrigger>
            <TabsTrigger value="의제" onClick={() => router.push('/')}>
              의제
            </TabsTrigger>
            <TabsTrigger value="투표자" onClick={() => router.push('/voter')}>
              투표자
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
      <div style={{ minHeight: '90vh', width: '60vw', margin: '0 auto' }}>{children}</div>
      <footer className=" bottom-0 left-0 w-full flex gap-[24px] flex-wrap items-center justify-center p-4 border-t">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/developerasun/ricktcal-worldcup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconGithub />
        </a>
      </footer>
    </>
  );
}
