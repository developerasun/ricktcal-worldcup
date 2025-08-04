'use client';

import { IAuth, IAuthContext, ILoginCookiePayload } from '@/types/application';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { TourProvider } from '@reactour/tour';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const AuthContext = createContext<IAuthContext>({
  auth: undefined,
  setAuth: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
  isLogin: ILoginCookiePayload | null;
}

function AuthContextProvider({ children, isLogin }: AuthContextProviderProps) {
  const hasAuth = isLogin ? (isLogin satisfies IAuth) : undefined;
  const [auth, setAuth] = useState<IAuth | undefined>(hasAuth);

  useEffect(() => {
    isLogin ? setAuth(hasAuth) : setAuth(undefined);
  }, [isLogin]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

function TourModalProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <TourProvider
      steps={[
        {
          selector: '.step-1',
          content: ({ currentStep, setIsOpen }) => (
            <div className="text-md text-black p-4 rounded shadow">
              월드컵 예시를 확인하세요. 참여 사도는 2명이고, 시작/종료일을 설정할 수 있습니다.
            </div>
          ),
        },
        {
          selector: '.step-2',
          content: ({ currentStep, setIsOpen }) => (
            <div className="text-md text-black p-4 rounded shadow">
              현재 진행 중인 월드컵들이 보여지는 곳입니다. pending, active, finish로 진행 상황을 구분하실 수 있습니다.
            </div>
          ),
        },
        {
          selector: '.step-3',
          content: ({ currentStep, setIsOpen }) => (
            <div className="text-md text-black p-4 rounded shadow">
              로그인 모달입니다. 지갑 패스키를 생성하여 로그인을 진행합니다.
            </div>
          ),
        },
        {
          selector: '.step-4',
          content: ({ currentStep, setIsOpen }) => (
            <div className="text-md text-black p-4 rounded shadow">
              네비게이션 창입니다.
              <li>포인트: 월드컵 재화 얻기</li>
              <li>월드컵: 메인 페이지</li>
              <li>투표자: 월드컵 참여 내역 확인</li>
              <li>개발자도구: API 문서 확인하기</li>
            </div>
          ),
        },
        {
          selector: '.step-5',
          content: ({ currentStep, setIsOpen }) => (
            <div className="flex flex-col text-md text-black p-4 rounded shadow">
              <p className="mb-4">깃허브 링크입니다. 프로젝트 소스 코드를 확인하실 수 있습니다.</p>
              <Button className="cursor-pointer" onClick={() => setIsOpen(false)}>
                투어 종료하기
              </Button>
            </div>
          ),
        },
      ]}
    >
      {children}
    </TourProvider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth, TourModalProvider };
