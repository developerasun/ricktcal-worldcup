import { HttpStatus, PointClaimAction, ProposalReward, ProposalStatus } from '@/constants';
import { getConnection, points, proposals, rewards, users, votes } from '@/server/database/schema';
import { ForbiddenException } from '@/server/error';
import { fromUTC, toDecimal } from '@/server/hook';
import { logger } from '@/server/logger';
import { and, between, eq, inArray, not, sql } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

/**
 * @swagger
 * /api/webhook/reward:
 *   post:
 *     tags:
 *       - ACTIONS
 *     description: trigger woldcup winning reward grant for voters. coupled with github actions in production.
 *     responses:
 *       200:
 *         description: return number of voters given grant on success
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

  const endings = await connection
    .select({
      id: proposals.id,
      endAt: proposals.endAt,
      diff: sql`${proposals.leftCharacterElif} - ${proposals.rightCharacterElif}`,
    })
    .from(proposals)
    .where(and(eq(proposals.endAt, today), eq(proposals.status, ProposalStatus.FINISHED)));

  logger.log({
    today,
    endAts: endings.map((e) => e.id),
  });

  // @dev early return for less db ops
  if (endings.length === 0) {
    logger.warn('no proposals ended today, so no grants today.');
    return NextResponse.json({ granted: [] });
  }

  const proposalIds = endings.map((e) => e.id);
  const voters = await connection
    .select({
      userId: votes.userId,
      userVote: votes.voteCast,
      proposalId: proposals.id,
      diff: sql<number>`${proposals.leftCharacterElif} - ${proposals.rightCharacterElif}`,
      left: proposals.leftCharacterName,
      right: proposals.rightCharacterName,
    })
    .from(votes)
    .innerJoin(proposals, eq(votes.proposalId, proposals.id))
    .where(inArray(votes.proposalId, proposalIds));

  const winners = voters.filter((v) => {
    const rounded = toDecimal(v.diff);
    const isTied = rounded === 0;
    const winningCast = rounded > 0 ? v.left : isTied ? null : v.right;
    if (winningCast === v.userVote) return v;
  });

  // @dev early return for less db ops
  if (winners.length === 0) {
    logger.warn('no voters to grant rewards.');
    return NextResponse.json({ granted: [] });
  }

  const winnerIds = winners.map((w) => w.userId);
  logger.info({ winnerIds });

  let realGranted = 0;
  for (const winner of winners) {
    const hasGiven = await connection
      .select()
      .from(rewards)
      .where(
        // prettier-ignore
        and(
          eq(rewards.userId, winner.userId), 
          eq(rewards.proposalId, winner.proposalId))
      );

    if (hasGiven.length === 0) {
      logger.info(
        `user(${winner.userId}) not given rewards for proposal(${winner.proposalId}) yet, start rewarding...`
      );

      await connection.batch([
        connection.insert(rewards).values({
          userId: winner.userId,
          proposalId: winner.proposalId,
          pointAmount: ProposalReward.WINNING,
        }),
        connection.insert(points).values({
          userId: winner.userId,
          score: ProposalReward.WINNING,
          action: PointClaimAction.WINNING,
        }),
        connection
          .update(users)
          .set({ point: sql`${users.point} + ${ProposalReward.WINNING}` })
          .where(eq(users.id, winner.userId)),
      ]);
      realGranted++;
    }
  }

  if (realGranted === 0) logger.warn('all winners gratend reward already');

  logger.info('worldcup winning rewards given to voters');
  return NextResponse.json({ granted: realGranted });
}
