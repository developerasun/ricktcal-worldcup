import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/ui/navigation';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Spacer } from '@/components/ui/spacer';
import { AuthContextProvider, TourModalProvider } from './store';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/constants/index';
import { AuthManager } from '@/server/hook';
import { ILoginCookiePayload, NotificationListType } from '@/types/application';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '릭트컬 거버넌스',
  description: '트릭컬 최애 사도 월드컵을 열어보자',
};

async function getNotificationList({ wallet }: { wallet: string }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/notification/${wallet}`, {
    cache: 'no-store', // @dev prevent calling fetch build-time
  });
  const raw = await response.json();
  return { raw };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isLogin: ILoginCookiePayload | null = null;
  let notifications: NotificationListType = [];

  const hasLoginCookie = (await cookies()).get(COOKIE_NAME.auth);
  if (hasLoginCookie) {
    const am = new AuthManager();
    const { payload } = await am._useTokenVerify({ token: hasLoginCookie.value });
    payload ? (isLogin = { wallet: payload.wallet }) : (isLogin = null);

    if (payload) {
      const { raw } = await getNotificationList({ wallet: payload.wallet });
      notifications = raw as NotificationListType;
    }
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthContextProvider isLogin={isLogin}>
            <TourModalProvider>
              <Navigation notifications={notifications}>
                <Spacer v={2} />
                {children}
                <Toaster position="top-right" />
              </Navigation>
            </TourModalProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
