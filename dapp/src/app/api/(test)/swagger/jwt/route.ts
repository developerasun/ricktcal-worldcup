import { AuthManager } from '@/server/hook';

/**
 * @swagger
 * /api/swagger/jwt:
 *   get:
 *     description: encrypt cookie payload and decrypt right away
 *     responses:
 *       200:
 *         description: jwt cycle was successful
 */
export async function GET(request: Request, context: any) {
  const am = new AuthManager();
  const { token } = await am._useTokenEncryption({ wallet: '0x123' });
  const { payload } = await am._useTokenVerify({ token });

  return Response.json({ token, payload });
}
