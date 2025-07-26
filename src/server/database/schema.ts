import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export async function initialize() {
  const context = await getCloudflareContext({ async: true });
  const connection = drizzle(context.env.DB);

  return { connection };
}

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  wallet: text({ length: 42 }).notNull(),
  nickname: text().notNull().default('게스트'),
});
