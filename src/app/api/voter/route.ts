import { getConnection, users } from '@/server/database/schema';
import { UnauthorizedException } from '@/server/error';
import { lt } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { connection } = await getConnection();
  const data = (await connection.select().from(users).where(lt(users.id, 25))) ?? [];

  return NextResponse.json(data);
}
