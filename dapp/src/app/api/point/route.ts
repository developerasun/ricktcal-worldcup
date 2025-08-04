import { COOKIE_NAME, POINT_RATE, PointClaimAction } from '@/constants/index';
import { getConnection, points, users } from '@/server/database/schema';
import { UnAuthorizedException } from '@/server/error';
import { AuthManager, validateAndFindIdentity } from '@/server/hook';
import { logger } from '@/server/logger';
import { PointClaimActionType } from '@/types/application';
import { eq, sql } from 'drizzle-orm';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.slice(7);
  let message: string | null = null;
  let data: any | null = null;

  if (!token || token === 'undefined') {
    const e = new UnAuthorizedException('잔고 확인을 위해 로그인이 필요합니다.');
    message = e.short().message;
  }

  if (!message) {
    const auth = JSON.parse(token!) as RequestCookie;
    const { wallet, point, elif, nickname } = await validateAndFindIdentity(auth);
    data = { wallet, point, elif, nickname };
  }

  return NextResponse.json(message ? message : data);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { userId, wallet } = await validateAndFindIdentity();
  let message: null | string = null;

  const { action } = data as { action: PointClaimActionType };
  const { connection } = await getConnection();

  const score = action === PointClaimAction.CHEEKPULLING ? POINT_RATE.cheekpulling : POINT_RATE.headpat;

  try {
    // @dev use javascript api instead of transaction in d1 environment
    await connection.batch([
      connection.insert(points).values({ score, userId, action }),
      connection
        .update(users)
        .set({ point: sql`${users.point} + ${score}` })
        .where(eq(users.id, userId)),
    ]);
    logger.info('successfully updated points and users table for point claim');
  } catch (error) {
    logger.error(error);
    message = JSON.stringify(error);
  } finally {
    return NextResponse.json({ message });
  }
}
