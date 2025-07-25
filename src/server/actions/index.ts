'use server';
import { Wallet } from 'ethers';

export async function increment(formData: any) {
  const { address, publicKey, privateKey, mnemonic } = Wallet.createRandom();

  // @dev serialize and toss to client
  return JSON.stringify({ address, publicKey, privateKey, mnemonic });
}
