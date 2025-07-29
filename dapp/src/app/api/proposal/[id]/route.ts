import { getConnection, proposals, users, votes } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const proposalId = +id;

  const { connection } = await getConnection();
  const proposal = (await connection.select().from(proposals).where(eq(proposals.id, proposalId))).pop();

  if (!proposal) throw new Error(`존재하지 않는 안건(${proposalId})입니다`);

  const voteHistory = await connection.select().from(votes).where(eq(votes.proposalId, +proposalId));

  return NextResponse.json({ proposal, voteHistory });
}
