import { getExponentialBackOff } from '@/server/hook';
import { logger } from '@/server/logger';
import { Elif } from '@/server/onchain';
import { HexType } from '@/types/contract';
import { delay } from 'es-toolkit';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ hash: string }> }) {
  const { hash } = await context.params;
  const { client } = new Elif().getInstance();

  const stream = new ReadableStream<string>({
    // @dev destructure would break this context for queue controller
    async start(controller) {
      const maxCount = 5;
      let attempt = 0;
      const baseDelay = 3_000;

      while (attempt < maxCount) {
        const { timegap } = getExponentialBackOff({ baseDelay, attempt });
        let chunk = '';

        try {
          const hasReceipt = await client.getTransactionReceipt({ hash: hash as HexType });
          chunk = `receipt: hash(${hasReceipt.transactionHash}) with status(${hasReceipt.status})`;
        } catch (error) {
          const message = `transaction(${hash}) not mined yet at attempt(${attempt})`;
          logger.warn(message);
          chunk = message;
        }

        controller.enqueue(`data: ${chunk} with delay(${timegap})\n\n`);
        attempt++;

        if (chunk.includes('receipt') || attempt === maxCount) {
          // @dev end req-res cycle when stream ends
          controller.close();
        }

        await delay(timegap);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
