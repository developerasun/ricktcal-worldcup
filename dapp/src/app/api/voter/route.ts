import { getConnection, users } from '@/server/database/schema';
import { desc, lt } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const defaultCount = 25;
  const { connection } = await getConnection();
  const _data = await connection.select().from(users).where(lt(users.id, defaultCount)).orderBy(desc(users.point));
  const data = _data ?? [];

  return NextResponse.json(data);
}
