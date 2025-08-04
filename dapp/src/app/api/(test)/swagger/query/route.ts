import { proposals, votes, users, getConnection } from '@/server/database/schema';
import { eq } from 'drizzle-orm';

/**
 * @swagger
 * /api/swagger/query:
 *   get:
 *     description: check out orm query result
 *     responses:
 *       200:
 *         description: entities quried by drizzle
 */
export async function GET(request: Request, context: any) {
  const { connection } = await getConnection();
  const data = await connection
    .select({ proposal: proposals, voteHistory: { ...votes, wallet: users.wallet } })
    .from(votes)
    .innerJoin(proposals, eq(votes.proposalId, proposals.id))
    .where(eq(votes.proposalId, 1))
    .innerJoin(users, eq(votes.userId, users.id))
    .get();

  return Response.json(data);
}
