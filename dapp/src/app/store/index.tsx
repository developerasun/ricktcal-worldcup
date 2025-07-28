'use client';

import { ILoginCookiePayload } from '@/types/application';
import { AddressLike } from 'ethers';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface IAuth {
  wallet: AddressLike;
}

interface IAuthContext {
  auth: IAuth | undefined;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | undefined>>;
}

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
