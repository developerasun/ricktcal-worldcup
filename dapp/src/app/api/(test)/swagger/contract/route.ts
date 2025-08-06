import { proposals, votes, users, getConnection } from '@/server/database/schema';
import { Elif } from '@/server/hook';
import { eq } from 'drizzle-orm';

/**
 * @swagger
 * /api/swagger/contract:
 *   get:
 *     description: call read request to alchemy node for `Elif` contract
 *     responses:
 *       200:
 *         description: return Elif's token name and symbol
 */
export async function GET(request: Request, context: any) {
  const { elif } = new Elif().instance();
  const name = await elif.name();
  const symbol = await elif.symbol();

  return Response.json({ name, symbol });
}
