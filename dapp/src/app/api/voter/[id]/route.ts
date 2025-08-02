import { HttpStatus } from '@/constants';
import { getConnection, proposals, users, votes } from '@/server/database/schema';
import { NotFoundException } from '@/server/error';
import { desc, eq, lt } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const userId = +id;
  const { connection } = await getConnection();
  const hasUser = await connection.select().from(users).where(eq(users.id, userId)).get();

  if (!hasUser) throw new NotFoundException('존재하지 않는 유저입니다', { code: HttpStatus.NOT_FOUND });

  const voteHistory = await connection
    .select()
    .from(votes)
    .innerJoin(proposals, eq(proposals.id, votes.proposalId))
    .where(eq(votes.userId, userId));
  const data = { user: hasUser, voteHistory };

  return NextResponse.json(data);
}
