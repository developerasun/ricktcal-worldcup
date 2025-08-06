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
  const forcedDecimals = await connection.run(`select ROUND(3.4141422 - 1.155, 2)`);

  return Response.json({ forcedDecimals });
}
