import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

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
  wallet: text({ length: 42 }).notNull().unique(),
  nickname: text().notNull().default('게스트').unique(),
  point: integer().notNull().default(HUMAN_BOOLEAN.zero),
  elif: real().notNull().default(HUMAN_BOOLEAN.zero),
});

export const points = sqliteTable('points', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer('userId').references(() => users.id),
  score: integer().notNull().default(HUMAN_BOOLEAN.zero),
  action: text().notNull(),
});

export const proposals = sqliteTable('proposals', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer('userId')
    .references(() => users.id)
    .notNull(),
  status: text().notNull(), // @dev keep varchar instead of check for easier migration
  title: text().notNull().unique(),
  description: text().notNull(),
  startAt: text(),
  endAt: text(),
  leftCharacterName: text().notNull().default('버터'),
  rightCharacterName: text().notNull().default('코미'),
  leftCharacterElif: real().notNull().default(HUMAN_BOOLEAN.zero),
  rightCharacterElif: real().notNull().default(HUMAN_BOOLEAN.zero),
});

export const votes = sqliteTable('votes', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer('userId').references(() => users.id),
  proposalId: integer('proposalId').references(() => proposals.id),
  voteCast: text(),
  elifAmount: real().notNull().default(HUMAN_BOOLEAN.zero),
});

export const exchanges = sqliteTable('exchanges', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer('userId').references(() => users.id),
  pointAmount: integer().notNull().default(HUMAN_BOOLEAN.zero),
  elifAmount: real().notNull().default(HUMAN_BOOLEAN.zero),
});
