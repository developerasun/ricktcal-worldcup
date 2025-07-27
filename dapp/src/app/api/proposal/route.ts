import { getConnection, proposals } from '@/server/database/schema';
import { lte } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const maxCount = 25;

  const { connection } = await getConnection();
  const data = await connection.select().from(proposals).where(lte(proposals.id, maxCount));

  return NextResponse.json(data);
}
