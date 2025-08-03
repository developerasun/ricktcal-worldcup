import { HttpStatus } from '@/constants';
import { getConnection, users } from '@/server/database/schema';
import { NotFoundException } from '@/server/error';
import { eq } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await context.params;
  let message: string | null = null;

  const { connection } = await getConnection();
  const hasUser = await connection.select().from(users).where(eq(users.wallet, wallet)).get();

  if (!hasUser) {
    const e = new NotFoundException('존재하지 않는 유저입니다', { code: HttpStatus.NOT_FOUND });
    message = e.short().message;
  }

  return NextResponse.json(message ? message : hasUser!);
}
