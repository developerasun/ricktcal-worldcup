import { POINT_RATE } from '@/constants/point';
import { getConnection, points, users } from '@/server/database/schema';
import { UnauthorizedException } from '@/server/error';
import { PointClaimActionType } from '@/types/application';
import { eq, sql } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const payload = request.cookies.get('ricktcal.session');
  let message: null | string = null;

  if (!payload) throw new UnauthorizedException();
  const { id, wallet } = JSON.parse(payload.value) as { id: number; wallet: string };
  const { action } = data as { action: PointClaimActionType };
  const { connection } = await getConnection();

  const score = action === 'cheekpulling' ? POINT_RATE.cheekpulling : POINT_RATE.headpat;

  try {
    // @dev use javascript api instead of transaction in d1 environment
    await connection.batch([
      connection.insert(points).values({ score, userId: id, action }),
      connection
        .update(users)
        .set({ point: sql`${users.point} + ${score}` })
        .where(eq(users.id, id)),
    ]);
    console.log('successfully updated points and users table for point claim');
  } catch (error) {
    console.error(error);
    message = JSON.stringify(error);
  } finally {
    return NextResponse.json({ message });
  }
}
