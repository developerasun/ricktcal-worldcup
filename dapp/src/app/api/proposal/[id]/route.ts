import { getConnection, proposals, votes } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const proposalId = +id;

  const { connection } = await getConnection();
  const proposal = (await connection.select().from(proposals).where(eq(proposals.id, proposalId))).pop();

  if (!proposal) throw new Error(`존재하지 않는 안건(${proposalId})입니다`);

  let voteHistory = await connection.select().from(votes).where(eq(votes.proposalId, +proposalId));

  if (voteHistory.length === 0) {
    voteHistory = [
      {
        id: 1,
        userId: 1,
        proposalId: 1,
        voteCast: 'left',
      },
    ];
  }

  return NextResponse.json({ proposal, voteHistory });
}
