import { HttpStatus } from '@/constants';
import { getConnection } from '@/server/database/schema';
import { ForbiddenException } from '@/server/error';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/swagger/query:
 *   get:
 *     tags:
 *       - APPLICATION
 *     description: check out orm query result
 *     responses:
 *       200:
 *         description: entities quried by drizzle
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

  const { connection } = await getConnection();
  const forcedDecimals = await connection.run(`select ROUND(3.4141422 - 1.155, 2)`);

  return Response.json({ forcedDecimals });
}
