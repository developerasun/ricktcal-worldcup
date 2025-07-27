'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface IAuth {
  id: number;
  wallet: string;
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
  isLogin: string | undefined;
}

function AuthContextProvider({ children, isLogin }: AuthContextProviderProps) {
  const hasAuth = isLogin ? (JSON.parse(isLogin) as IAuth) : undefined;
  const [auth, setAuth] = useState<IAuth | undefined>(hasAuth);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth };
