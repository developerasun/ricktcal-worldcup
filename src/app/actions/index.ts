'use server';
import { Wallet } from 'ethers';
import { ADJECTIVES, HEROS } from '@/server/constants/nickname';
import { getConnection, proposals, users } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateWallet(formData: any) {
  const { address, mnemonic } = Wallet.createRandom();
  let left = Math.floor(Math.random() * (ADJECTIVES.length - 1));
  let right = Math.floor(Math.random() * (HEROS.length - 1));
  let nickname = `${ADJECTIVES[left]} ${HEROS[right]}`;

  const { connection } = await getConnection();
  const isDuplicated = await connection.select().from(users).where(eq(users.nickname, nickname));

  if (isDuplicated) {
    console.info(`generateWallet: nickname duplicate detected, retry once`);
    left = Math.floor(Math.random() * (ADJECTIVES.length - 1));
    right = Math.floor(Math.random() * (HEROS.length - 1));
    nickname = `${ADJECTIVES[left]} ${HEROS[right]}`;
  }

  const { error, results } = await connection.insert(users).values({ wallet: address, nickname });
  console.log({ results });

  if (error) {
    console.error(error);
    throw new Error(error);
  }

  // @dev serialize and toss to client
  return JSON.stringify({ address, mnemonic: mnemonic?.phrase });
}

export async function recoverAndSignIn(prevState: string | undefined, formData: FormData) {
  const data = formData.get('mnemonic') as string | undefined;
  let message: undefined | string = undefined;
  let isSuccess = false;
  const phrase = data ?? '';

  try {
    const recovered = Wallet.fromPhrase(phrase);
    const { connection } = await getConnection();
    const result = await connection.select().from(users).where(eq(users.wallet, recovered.address)).get();

    if (!result) throw new Error('recoverAndSignIn: invalid match for mnemonic and database');

    (await cookies()).set('ricktcal.session', 'true', {
      httpOnly: true,
      path: '/',
      secure: true,
      maxAge: 60 * 60 * 2,
    });
    isSuccess = true;
  } catch (error) {
    console.error(error);
    message = JSON.stringify(error);
  } finally {
    if (!isSuccess) return message;

    redirect('/');
  }
}

export async function createNewProposal(prevState: string | undefined, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  console.log({ title, description, startAt, endAt });

  const { connection } = await getConnection();
  const { error, results } = await connection.insert(proposals).values({
    title,
    description,
    status: 'pending',
    startAt,
    endAt,
  });

  if (error) throw new Error(error);

  console.log({ results });
  return '';
}
