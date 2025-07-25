import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  wallet: text({ length: 42 }).notNull(),
  nickname: text().notNull().default('게스트'),
});
