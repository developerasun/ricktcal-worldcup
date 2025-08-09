import { HttpStatus, PendingOnchainAction } from '@/constants';
import { getConnection, pendings } from '@/server/database/schema';
import { ForbiddenException } from '@/server/error';
import { logger } from '@/server/logger';
import { Elif } from '@/server/onchain';
import { HexType } from '@/types/contract';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { TransactionReceipt } from 'viem';

export async function POST(request: NextRequest) {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'production') {
    const { BEARER_TOKEN } = process.env;
    const token = request.headers.get('authorization')?.split(' ').pop();
    const isValid = BEARER_TOKEN === token;

    if (!token || !isValid) {
      const e = new ForbiddenException('유효하지 않은 api 키입니다.', { code: HttpStatus.FORBIDDEN });
      const response = e.short();
      return NextResponse.json(response);
    }
  }

  const { client } = new Elif().getInstance();
  const { connection } = await getConnection();

  const confirmStatus = {
    failure: 0,
    success: 1,
  };
  const batchUnit = 50;
  const pendingTxs = await connection
    .select()
    .from(pendings)
    .where(eq(pendings.isConfirmed, confirmStatus.failure))
    .orderBy(desc(pendings.id))
    .limit(batchUnit);

  if (pendingTxs.length === 0) return NextResponse.json('none to sync');

  // @dev run all requests concurrently for faster asynchrous io
  const targets = pendingTxs.map((p) => client.getTransactionReceipt({ hash: p.txHash as HexType }));
  const result = await Promise.allSettled(targets);
  const resolved = result
    .filter((r): r is PromiseFulfilledResult<TransactionReceipt> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value.transactionHash);

  await connection
    .update(pendings)
    .set({ isConfirmed: confirmStatus.success })
    .where(inArray(pendings.txHash, resolved));

  const updated = await connection.select().from(pendings).where(inArray(pendings.txHash, resolved));

  const votePendings = updated.filter((v) => v.action === PendingOnchainAction.VOTE);
  const exchangePendings = updated.filter((p) => p.action === PendingOnchainAction.EXCHANGE);

  if (votePendings.length === 0 && exchangePendings.length === 0)
    return NextResponse.json('none of vote/exchange pendings to sync found');

  for (const vp of votePendings) {
    const { userId, proposalId, voteCast, elifAmount, signature, digest, isLeftVote } = vp;
    await connection.run(
      `
      insert into votes 
      (userId, proposalId, voteCast, elifAmount, signature, digest) 
      values(${userId}, ${proposalId}, ${voteCast}, ${elifAmount}, ${signature}, ${digest})
      `
    );
    await connection.run(
      `
      update users set elif = ROUND(elif - ${elifAmount}, 2)
      where id = ${userId}
      `
    );
    await connection.run(
      `
      update proposals set ${
        isLeftVote === 'true'
          ? `leftCharacterElif = ROUND(leftCharacterElif + ${elifAmount}, 2)`
          : `rightCharacterElif = ROUND(rightCharacterElif + ${elifAmount}, 2)`
      }
      where id = ${proposalId}
      `
    );
  }

  for (const ep of exchangePendings) {
    const { userId, elifAmount, pointAmount } = ep;
    await connection.run(
      `
      update users set 
      point = point - ${pointAmount},
      elif = ROUND(elif + ${elifAmount}, 2) where id = ${userId},
      `
    );
  }

  logger.info('sync and restore done');

  return NextResponse.json({ votePendings: votePendings.length, exchangePendings: exchangePendings.length });
}
