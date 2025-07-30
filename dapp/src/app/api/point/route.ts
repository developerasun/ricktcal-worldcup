import { COOKIE_NAME, HttpStatus, POINT_RATE } from '@/constants/index';
import { getConnection, points, users } from '@/server/database/schema';
import { NotFoundException, UnauthorizedException } from '@/server/error';
import { validateAndFindIdentity } from '@/server/hook';
import { PointClaimActionType } from '@/types/application';
import { eq, sql } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { userId, wallet } = await validateAndFindIdentity();
  let message: null | string = null;

  const { action } = data as { action: PointClaimActionType };
  const { connection } = await getConnection();

  const score = action === 'cheekpulling' ? POINT_RATE.cheekpulling : POINT_RATE.headpat;

  try {
    // @dev use javascript api instead of transaction in d1 environment
    await connection.batch([
      connection.insert(points).values({ score, userId, action }),
      connection
        .update(users)
        .set({ point: sql`${users.point} + ${score}` })
        .where(eq(users.id, userId)),
    ]);
    console.log('successfully updated points and users table for point claim');
  } catch (error) {
    console.error(error);
    message = JSON.stringify(error);
  } finally {
    return NextResponse.json({ message });
  }
}
