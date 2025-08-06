import { HttpStatus } from '@/constants';
import { ForbiddenException } from '@/server/error';
import { logger } from '@/server/logger';
import { Elif, tryWithBackOff } from '@/server/onchain';
import { delay, retry } from 'es-toolkit';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/swagger/contract:
 *   get:
 *     tags:
 *       - ONCHAIN
 *     description: call read request to alchemy node for `Elif` contract. try 3 times and succeed at last trial
 *     responses:
 *       200:
 *         description: return Elif's token name
 */
export async function GET(request: Request, context: any) {
  const { NODE_ENV } = process.env;

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

  const { elif } = new Elif().getInstance();
  let attempt = 0;
  let tokenName: null | string = null;

  // @dev should not use try-catch inside callback since retry detects throw for retry
  const callback = async () => {
    const target = 5;
    attempt += 1;

    if (attempt !== target) {
      logger.warn(`[Callback] Attempt ${attempt} failed at ${new Date().toISOString()}`);
      throw new Error(`Attempt ${attempt} did not reach target ${target}`);
    }

    // 성공 로직
    tokenName = await elif.name();
    logger.info('done');
  };

  const { isSuccess } = await tryWithBackOff(callback);

  return Response.json({ tokenName, isSuccess });
}
