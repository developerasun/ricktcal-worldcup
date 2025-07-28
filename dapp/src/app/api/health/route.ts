/**
 * @swagger
 * /api/health:
 *   get:
 *     description: check if server is running
 *     responses:
 *       200:
 *         description: return a 'ok' string
 */
export async function GET(request: Request, context: any) {
  return Response.json('ok');
}
