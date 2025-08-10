import { HttpStatus } from '@/constants';
import { ForbiddenException } from '@/server/error';
import { txCastVote } from '@/server/onchain';
import { HexType } from '@/types/contract';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/swagger/contract/vote:
 *   get:
 *     tags:
 *       - ONCHAIN
 *     description: try cast vote request to alchemy node with exponential backoff retries
 *     responses:
 *       200:
 *         description: return tx hash, nonce, and request result as boolean
 */
export async function GET(request: Request, context: any) {
  const { NODE_ENV, ROOT_WALLET_ADDRESS } = process.env;

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

  // @dev use pre-generated signing values on frontend for test
  const digest = '0x23570920339db06ae65725593c584550c31716a0fa8ec4b8748d247db4a53636';
  const signature =
    '0x5238c598d31318e32480b3fe6c3215765dc423432f01f60d7ef132fb7ac8b092462d8ed48627e1cd8288ea3c0728a7640aaa38fe1ea33899f6217857f8b218831c';
  const signer = '0x709974eD57E06F78B081D7ccbB47ed598C051356';

  const voteArgs = {
    proposalId: 1,
    voter: signer as HexType,
    voteCast: {
      digest: digest as HexType,
      signature: signature as HexType,
      hasVoted: false,
    },
    amount: 1,
  };

  const { isSuccess, hasTracked, hash, nonce } = await txCastVote({ ...voteArgs });
  return Response.json({ isSuccess, hasTracked, hash, nonce });
}
