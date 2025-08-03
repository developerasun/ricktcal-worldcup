import React from 'react';
import ClaimAndExchange from './claim-exchange';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/constants';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { IVoter } from '@/types/application';

interface Props {}

async function getVoterBalance({ auth }: { auth: RequestCookie | undefined }) {
  const response = await fetch(`${process.env.BASE_ENDPOINT}/api/point`, {
    headers: {
      authorization: `bearer ${JSON.stringify(auth)}`,
    },
    cache: 'no-store', // @dev prevent calling fetch build-time
  });

  const raw = (await response.json()) as string | Omit<IVoter, 'id'>;
  return { raw };
}

export default async function PointPage({}: Props) {
  const auth = (await cookies()).get(COOKIE_NAME.auth);
  const { raw } = await getVoterBalance({ auth });

  return (
    <>
      <ClaimAndExchange balanceOrMessage={raw} />
    </>
  );
}
