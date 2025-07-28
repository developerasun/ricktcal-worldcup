import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

/**
 * @swagger
 * /api/health:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(request: Request, context: any) {
  const data = 'hi';
  const e = await getCloudflareContext({ async: true });
  const db = drizzle(e.env.DB);

  const { error, success, results } = await db.run(`select 1`);

  if (error) throw new Error(error);

  return Response.json({ data, query: results });
}
