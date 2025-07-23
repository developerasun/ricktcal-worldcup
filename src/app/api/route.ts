// export const runtime = "edge"; // Cloudflare Workers에서 동작하게!
// import { promisify } from 'node:util';
// import * as _ from 'sqlite3'
// const db = new _.Database('rictcal.db')
// const run = promisify(db.run)
// import { env } from "cloudflare:workers"
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request, context: any) {
const data = "d"
const e= await getCloudflareContext({ async: true })
const ee = e.env.NEXTJS_ENV
// const ss =await e.env.DB.exec(`select 1`)
// console.log ({e})
console.log ({ee})
// console.log(context.env.DB)
//  console.log(env.NEXTJS_ENV)
  return Response.json({ data, ee })
}