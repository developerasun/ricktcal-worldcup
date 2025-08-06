import { HttpStatus } from '@/constants';
import { ForbiddenException } from '@/server/error';
import { Elif } from '@/server/hook';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/swagger/contract:
 *   get:
 *     description: call read request to alchemy node for `Elif` contract
 *     responses:
 *       200:
 *         description: return Elif's token name and symbol
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

  const { elif } = new Elif().instance();
  const name = await elif.name();
  const symbol = await elif.symbol();

  return Response.json({ name, symbol });
}
