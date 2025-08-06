import { fromUTC } from '@/server/hook';

/**
 * @swagger
 * /api/swagger/datetime:
 *   get:
 *     tags:
 *       - APPLICATION
 *     description: mess around date utility with Date object
 *     responses:
 *       200:
 *         description: date in different formats
 */
export async function GET(request: Request, context: any) {
  const { full, short } = fromUTC();

  return Response.json({ full, short });
}
