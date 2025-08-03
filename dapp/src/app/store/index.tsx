'use client';

import { IAuth, IAuthContext, ILoginCookiePayload } from '@/types/application';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth };
