import { NotificationStatus } from '@/constants';
import { getConnection, notifications, users, votes } from '@/server/database/schema';
import { validateAndFindIdentity } from '@/server/hook';
import { and, eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await context.params;
  const { connection } = await getConnection();
  const raw = await connection
    .select({ n: notifications })
    .from(notifications)
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(and(eq(users.wallet, wallet), eq(notifications.status, NotificationStatus.UNREAD)));
  const hasNotifications = raw.map((r) => r.n);

  return NextResponse.json(hasNotifications);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { notificationId } = data as { notificationId: number };

  await validateAndFindIdentity();
  const { connection } = await getConnection();

  await connection
    .update(notifications)
    .set({ status: NotificationStatus.READ })
    .where(eq(notifications.id, notificationId));

  return NextResponse.json('ok');
}
