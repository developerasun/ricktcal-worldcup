import { HttpStatus } from '@/constants';
import { getConnection, proposals, users, votes } from '@/server/database/schema';
import { BadRequestException } from '@/server/error';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { merge } from 'es-toolkit';
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const proposalId = +id;

  const { connection } = await getConnection();
  const proposal = (await connection.select().from(proposals).where(eq(proposals.id, proposalId))).pop();

  if (!proposal) {
    const e = new BadRequestException(`존재하지 않는 안건(${proposalId})입니다`, { code: HttpStatus.NOT_FOUND });
    return NextResponse.json(e.short());
  }

  const voteHistory = await connection.select().from(votes).where(eq(votes.proposalId, +proposalId));
  const userIds = voteHistory.map((v) => v.userId);
  const _users = await connection
    .select({ userId: users.id, wallet: users.wallet, nickname: users.nickname })
    .from(users)
    .where(inArray(users.id, userIds));

  const wallets = new Map<number, { nickname: string; wallet: string }>();
  _users.forEach((u) => {
    wallets.set(u.userId, { nickname: u.nickname, wallet: u.wallet });
  });

  const serializeSafeWallets = Object.fromEntries(wallets); // if not, client will see empty object like {}

  return NextResponse.json({ proposal, voteHistory, wallets: serializeSafeWallets });
}
