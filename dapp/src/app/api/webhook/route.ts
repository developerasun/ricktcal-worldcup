import { ProposalStatus } from '@/constants';
import { getConnection, proposals } from '@/server/database/schema';
import { UnauthorizedException } from '@/server/error';
import { fromUTC, getKoreanTimezone } from '@/server/hook';
import { and, eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     description: trigger pending proposal to be active
 *     responses:
 *       200:
 *         description: return proposal id on success
 */
export async function POST(request: NextRequest) {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'production') {
    const { BEARER_TOKEN } = process.env;
    const token = request.headers.get('authorization')?.split(' ').pop();
    const isValid = BEARER_TOKEN === token;

    if (!token || !isValid) {
      throw new UnauthorizedException();
    }
  }

  const { connection } = await getConnection();
  const { short: today } = fromUTC();

  const pendings = await connection
    .select({ id: proposals.id, startAt: proposals.startAt })
    .from(proposals)
    .where(and(eq(proposals.status, ProposalStatus.PENDING), eq(proposals.startAt, today)));

  console.log({ today, startAts: pendings.map((p) => p.startAt) });

  const ids = pendings.map((p) => p.id);
  await connection.update(proposals).set({ status: ProposalStatus.ACTIVE }).where(inArray(proposals.id, ids));

  return NextResponse.json({ proposals: ids });
}
