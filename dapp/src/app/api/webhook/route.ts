import { UnauthorizedException } from '@/server/error';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { BEARER_TOKEN } = process.env;
  const token = request.headers.get('authorization')?.split(' ').pop();
  const isValid = BEARER_TOKEN === token;

  if (!token || !isValid) {
    throw new UnauthorizedException();
  }

  return NextResponse.json({ message: 'ok', isValid, token });
}
