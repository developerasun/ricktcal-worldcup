import { POINT_RATE } from '@/constants/point';
import { getConnection, points } from '@/server/database/schema';
import { UnauthorizedException } from '@/server/error';
import { PointClaimActionType } from '@/types/application';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const payload = request.cookies.get('ricktcal.session');

  if (!payload) throw new UnauthorizedException();
  const { id, wallet } = JSON.parse(payload.value) as { id: number; wallet: string };
  const { action } = data as { action: PointClaimActionType };
  const { connection } = await getConnection();

  const score = action === 'cheekpulling' ? POINT_RATE.cheekpulling : POINT_RATE.headpat;
  const { error, success, results } = await connection.insert(points).values({ score, userId: id, action });

  if (error) throw new Error(error);
  console.log({ data, payload, results, wallet });
  return NextResponse.json({ message: success });
}
