import { UnauthorizedException } from '@/server/error';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'ok' });
}
