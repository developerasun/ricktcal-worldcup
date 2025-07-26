import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, integer, text, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const HUMAN_BOOLEAN = {
  true: 1,
  false: 0,
  zero: 0,
} as const;

export async function getConnection() {
  const context = await getCloudflareContext({ async: true });
  const connection = drizzle(context.env.DB);

  return { connection };
}

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  wallet: text({ length: 42 }).notNull(),
  nickname: text().notNull().default('게스트').unique(),
  point: integer().notNull().default(HUMAN_BOOLEAN.zero),
  elif: integer().notNull().default(HUMAN_BOOLEAN.zero),
});

export const points = sqliteTable(
  'points',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer('userId').references(() => users.id),
    score: integer().notNull().default(HUMAN_BOOLEAN.zero),
    action: text().notNull(),
  },
  (table) => [check('action_type', sql`${table.action} IN ('cheekpulling', 'headpat')`)]
);

export const proposals = sqliteTable(
  'proposals',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer('userId').references(() => users.id),
    isActive: integer().notNull().default(HUMAN_BOOLEAN.false),
    status: text().notNull(),
    title: text().notNull().unique(),
    description: text().notNull(),
    startAt: text(),
    endAt: text(),
    leftCharacterName: text().notNull().default('버터'),
    rightCharacterName: text().notNull().default('코미'),
  },
  (table) => [
    check('status_type', sql`${table.status} IN ('pending', 'active', 'approved', 'rejected')`),
    check('activeness_type', sql`${table.isActive} IN (0, 1)`),
  ]
);
