import { HttpStatus } from '@/constants';
import { getConnection, onchains, proposals, users, votes } from '@/server/database/schema';
import { NotFoundException } from '@/server/error';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await context.params;
  let message: string | null = null;

  const { connection } = await getConnection();
  const hasUser = await connection.select().from(users).where(eq(users.wallet, wallet)).get();

  if (!hasUser) {
    const e = new NotFoundException('존재하지 않는 유저입니다', { code: HttpStatus.NOT_FOUND });
    message = e.short().message;
  }

  const _propsoalIds = await connection
    .select({ propsoalId: votes.proposalId })
    .from(votes)
    .where(eq(votes.userId, hasUser!.id));
  const propsoalIds = _propsoalIds.map((p) => p.propsoalId);
  const _hashes = await connection
    .select({ hash: onchains.txHash })
    .from(onchains)
    .where(inArray(onchains.proposalId, propsoalIds));
  const hashes = _hashes.map((h) => h.hash);

  return NextResponse.json(message ? message : { user: hasUser!, hashes });
}
