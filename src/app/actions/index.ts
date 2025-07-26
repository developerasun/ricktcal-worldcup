'use server';
import { Wallet } from 'ethers';
import { ADJECTIVES, HEROS } from '@/server/constants/nickname';
import { getConnection, users } from '@/server/database/schema';
import { eq } from 'drizzle-orm';

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
