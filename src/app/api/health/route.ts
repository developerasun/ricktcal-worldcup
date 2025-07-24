import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: Request, context: any) {
  const data = 'hi';
  const e = await getCloudflareContext({ async: true });
  const ee = e.env.NEXTJS_ENV;
  const ss = await e.env.DB.exec(`select 1`);

  return Response.json({ data, ee, ss });
}
