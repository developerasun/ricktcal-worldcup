import { HttpStatus, ProposalStatus } from '@/constants';
import { getConnection, proposals } from '@/server/database/schema';
import { ForbiddenException } from '@/server/error';
import { fromUTC } from '@/server/hook';
import { logger } from '@/server/logger';
import { and, eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     tags:
 *       - ACTIONS
 *     description: trigger pending proposal to be active, active one to be finished. coupled with github actions in production.
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
      const e = new ForbiddenException('유효하지 않은 api 키입니다.', { code: HttpStatus.FORBIDDEN });
      const response = e.short();
      return NextResponse.json(response);
    }
  }

  const { connection } = await getConnection();
  const { short: today } = fromUTC();

  const pendings = await connection
    .select({ id: proposals.id, startAt: proposals.startAt })
    .from(proposals)
    .where(and(eq(proposals.status, ProposalStatus.PENDING), eq(proposals.startAt, today)));

  const endings = await connection
    .select({ id: proposals.id, endAt: proposals.endAt })
    .from(proposals)
    .where(and(eq(proposals.endAt, today), eq(proposals.status, ProposalStatus.ACTIVE)));

  // @dev early return for less db ops
  if (pendings.length === 0 && endings.length === 0) {
    return NextResponse.json({ active: [], fisnihed: [] });
  }

  logger.log({ today, startAts: pendings.map((p) => p.startAt) });

  const pendingIds = pendings.map((p) => p.id);
  const endingIds = endings.map((e) => e.id);

  await connection.batch([
    connection.update(proposals).set({ status: ProposalStatus.ACTIVE }).where(inArray(proposals.id, pendingIds)),
    connection.update(proposals).set({ status: ProposalStatus.FINISHED }).where(inArray(proposals.id, endingIds)),
  ]);

  return NextResponse.json({ active: pendingIds, fisnihed: endingIds });
}
