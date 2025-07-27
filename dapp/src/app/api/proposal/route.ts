import { getConnection, proposals, votes } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const fallbackId = 1;
  const proposalId = url.searchParams.get('proposalId') ?? fallbackId;

  const { connection } = await getConnection();
  const proposal = await connection.select().from(proposals).where(eq(proposals.id, +proposalId));
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

  return NextResponse.json({ proposal: proposal[0], voteHistory });
}
