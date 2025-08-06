import { HttpStatus } from '@/constants';
import { ForbiddenException } from '@/server/error';
import { txMint } from '@/server/onchain';
import { parseEther } from 'ethers';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/swagger/contract/mint:
 *   get:
 *     tags:
 *       - ONCHAIN
 *     description: try mint request to alchemy node with exponential backoff retries
 *     responses:
 *       200:
 *         description: return tx hash, nonce, and request result as boolean
 */
export async function GET(request: Request, context: any) {
  const { NODE_ENV, ROOT_WALLET_ADDRESS } = process.env;

  if (NODE_ENV === 'production') {
    const { BEARER_TOKEN } = process.env;
    const token = request.headers.get('authorization')?.split(' ').pop();
    const isValid = BEARER_TOKEN === token;

    if (!token || !isValid) {
      const e = new ForbiddenException('유효하지 않은 api 키입니다.', { code: HttpStatus.FORBIDDEN });
      const response = e.short();
      return NextResponse.json(response);
    }
  }

  const { isSuccess, hash, nonce } = await txMint({ to: ROOT_WALLET_ADDRESS, amount: parseEther('1') });
  return Response.json({ isSuccess, hash, nonce });
}
