'use server';
import { AddressLike, Wallet, ZeroAddress } from 'ethers';
import { ADJECTIVES, BRAND_NAME, COOKIE_NAME, HEROS, HttpStatus, POINT_RATE, ProposalStatus } from '@/constants/index';
import { exchanges, getConnection, proposals, users, votes } from '@/server/database/schema';
import { and, eq, inArray, not, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  AuthManager,
  getKoreanTimezone,
  toDecimal,
  toEthSignedMessageHash,
  validateAndFindIdentity,
} from '@/server/hook';
import { IAccountCredentials, IVoteSignPayload, VoteCastType } from '@/types/application';
import { nanoid } from 'nanoid';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '@/server/error';
import { logger } from '@/server/logger';

export async function generateWallet(prevState: IAccountCredentials | undefined, formData: FormData) {
  const { address, mnemonic } = Wallet.createRandom();
  let left = Math.floor(Math.random() * (ADJECTIVES.length - 1));
  let right = Math.floor(Math.random() * (HEROS.length - 1));
  let nickname = `${ADJECTIVES[left]} ${HEROS[right]}`;

  const { connection } = await getConnection();
  const isDuplicated = await connection.select().from(users).where(eq(users.nickname, nickname));

  if (isDuplicated) {
    console.info(`generateWallet: nickname duplicate detected, retry once`);
    left = Math.floor(Math.random() * (ADJECTIVES.length - 1));
    right = Math.floor(Math.random() * (HEROS.length - 1));
    nickname = `${ADJECTIVES[left]} ${HEROS[right]}`;
  }

  const { error, results } = await connection.insert(users).values({ wallet: address, nickname });
  logger.info({ results });

  if (error) {
    console.error(error);
    throw new Error(error);
  }

  const credentials: IAccountCredentials = {
    address,
    mnemonic: mnemonic?.phrase,
    nickname,
  };

  // @dev serialize and toss to client
  return credentials;
}

export async function recoverAndSignIn(prevState: string | undefined, formData: FormData) {
  const data = formData.get('mnemonic') as string | undefined;
  let message: undefined | string = undefined;
  let isSuccess = false;
  const phrase = data ?? '';

  try {
    const recovered = Wallet.fromPhrase(phrase);
    const { connection } = await getConnection();
    const result = await connection.select().from(users).where(eq(users.wallet, recovered.address)).get();

    if (!result) {
      const e = new NotFoundException('데이터베이스에 존재하지 않는 지갑 정보입니다.', { code: HttpStatus.NOT_FOUND });
      message = e.short().message;
      return message;
    }

    const { wallet } = result!;
    const am = new AuthManager();
    const { token } = await am._useTokenEncryption({ wallet });

    (await cookies()).set(COOKIE_NAME.auth, token, {
      httpOnly: true,
      path: '/',
      secure: true,
      maxAge: 60 * 60 * 2,
    });
    isSuccess = true;
  } catch (error) {
    console.error(error);
    message = JSON.stringify(error);
  } finally {
    if (!isSuccess) return message;

    // @dev revalidate cache before redirect ends a req-res cycle
    revalidatePath('/');
    redirect('/');
  }
}

export async function clearAndLogOut(prevState: void, formData: FormData) {
  await validateAndFindIdentity();
  (await cookies()).delete(COOKIE_NAME.auth);

  revalidatePath('/');
  redirect('/'); // @dev revalidate cookie on redirect. csr does not so invoke server side error logging
}

export async function createNewProposal(prevState: void, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  const leftCharacterName = formData.get('left-character') as string;
  const rightCharacterName = formData.get('right-character') as string;

  logger.info({ title, description, startAt, endAt, leftCharacterName, rightCharacterName });

  const { userId } = await validateAndFindIdentity();
  const { connection } = await getConnection();
  const proposal = await connection
    .insert(proposals)
    .values({
      title,
      description,
      userId,
      status: ProposalStatus.PENDING,
      startAt,
      endAt,
      leftCharacterName,
      rightCharacterName,
    })
    .returning()
    .get();

  redirect(`/proposal/${proposal.id}`);
}

export async function createNewVoteWithSignature(
  prevState: { payload: IVoteSignPayload; signature: string; digest: string } | undefined,
  formData: FormData
) {
  const voteCast = formData.get('vote-cast') as VoteCastType;
  const mnemonic = formData.get('mnemonic') as string;
  const elifVotingPower = formData.get('elif-voting-power') as string;
  let signer: AddressLike = ZeroAddress;

  const auth = (await cookies()).get(COOKIE_NAME.auth);
  const am = new AuthManager();

  if (auth) {
    const { payload } = await am._useTokenVerify({ token: auth.value });

    if (payload) signer = payload.wallet;
  }

  const payload: IVoteSignPayload = {
    issuer: BRAND_NAME.project,
    signer,
    url: 'https://demo.developerasun.dpdns.org',
    network: 'ethereum-sepolia',
    version: 1,
    chainId: 111555,
    nonce: nanoid(),

    // @dev keep consistent tz, cf worker tz might be different
    timestamp: getKoreanTimezone(),
    voteCast,
    votingPower: elifVotingPower,
  };
  const { digest } = toEthSignedMessageHash(JSON.stringify(payload));
  const { signature } = await am._useDigitalSignature({ message: JSON.stringify(payload), mnemonic });
  logger.info({ digest, signature });

  return { payload, signature, digest };
}

export async function createVotingTransaction(prevState: string | undefined, formData: FormData) {
  const auth = (await cookies()).get(COOKIE_NAME.auth);

  if (!auth) throw new UnAuthorizedException();
  const token = auth.value;
  const am = new AuthManager();
  const { payload } = await am._useTokenVerify({ token });

  const voteCast = formData.get('vote-cast-hidden') as string;
  const proposalId = formData.get('proposal-id-hidden') as string;
  const elifVotingPower = formData.get('elif-voting-power-hidden') as string;
  const signature = formData.get('signature-hidden') as string;
  const digest = formData.get('digest-hidden') as string;
  logger.info({ voteCast, proposalId, elifVotingPower, signature });

  let message: string | undefined = 'ok';

  if (!payload) {
    const e = new UnAuthorizedException('유저 정보가 확인되지 않았습니다. 로그인이 필요합니다.', {
      code: HttpStatus.UNAUTHORIZED,
    });
    message = e.short().message;
  }
  const wallet = payload!.wallet.toString();

  const { connection } = await getConnection();
  const hasProposal = await connection
    .select({ id: proposals.id, status: proposals.status, leftCharacterName: proposals.leftCharacterName })
    .from(proposals)
    .where(eq(proposals.id, +proposalId))
    .get();

  if (!hasProposal) {
    const e = new NotFoundException('존재하지 않는 안건입니다.', { code: HttpStatus.NOT_FOUND });
    message = e.short().message;
  }

  const isActiveProposal = hasProposal!.status === ProposalStatus.ACTIVE;
  if (!isActiveProposal) {
    const e = new BadRequestException('아직 투표 시작이 되지 않은 안건입니다.', { code: HttpStatus.BAD_REQUEST });
    message = e.short().message;
  }

  const hasUser = await connection.select().from(users).where(eq(users.wallet, wallet)).get();
  if (!hasUser) {
    const e = new UnAuthorizedException('유효하지 않은 유저 정보입니다. 유저 아이디를 확인해주세요.', {
      code: HttpStatus.UNAUTHORIZED,
    });
    message = e.short().message;
  }

  const { id: userId, elif } = hasUser!;
  const calculated = toDecimal(+elifVotingPower);
  const hasEnoughElif = elif >= calculated;

  if (!hasEnoughElif) {
    const e = new BadRequestException(`투표를 위한 엘리프 수량이 부족합니다(보유량: ${elif}, 투표량: ${calculated})`, {
      code: HttpStatus.BAD_REQUEST,
    });
    message = e.short().message;
  }

  const hasVoted = await connection
    .select()
    .from(votes)
    .where(and(eq(votes.userId, userId), eq(votes.proposalId, +proposalId)))
    .get();

  if (hasVoted) {
    const e = new BadRequestException('이미 투표하신 안건입니다.', {
      code: HttpStatus.BAD_REQUEST,
    });
    message = e.short().message;
  }

  const isLeftVote = hasProposal!.leftCharacterName === voteCast;
  const increaseLeftVotingPower = { leftCharacterElif: sql`ROUND(${proposals.leftCharacterElif} + ${calculated}, 2)` };
  const increaseRightVotingPower = {
    rightCharacterElif: sql`ROUND(${proposals.rightCharacterElif} + ${calculated}, 2)`,
  };

  if (!hasVoted && hasEnoughElif && message === 'ok') {
    await connection.batch([
      // prettier-ignore
      connection.insert(votes).values({ 
        userId, 
        proposalId: +proposalId, 
        voteCast, 
        elifAmount: calculated,
        signature,
        digest
      }),
      connection
        .update(users)
        .set({ elif: sql`ROUND(${users.elif} - ${calculated}, 2)` })
        .where(eq(users.id, userId)),
      connection.update(proposals).set(isLeftVote ? increaseLeftVotingPower : increaseRightVotingPower),
    ]);
    // TODO add contract interaction
  }
  logger.info({ hasVoted });

  return message;
}

export async function exchangePointToElif(prevState: string | undefined, formData: FormData) {
  const $pointAmount = formData.get('point') as string;
  const calculated = +$pointAmount / POINT_RATE.elif;

  let message: string | null = 'ok';

  if (calculated > Number.MAX_SAFE_INTEGER) {
    const e = new BadRequestException('범위에서 벗어난 교환 비율입니다', { code: HttpStatus.BAD_REQUEST });
    message = e.short().message;
  }

  const { userId } = await validateAndFindIdentity();

  // @dev limit decimal points to 2
  const elifAmount = toDecimal(calculated);
  const pointAmount = +$pointAmount;
  const { connection } = await getConnection();

  const raw = await connection.select({ balance: users.point }).from(users).where(eq(users.id, userId)).get();

  if (!raw) {
    const e = new NotFoundException('존재하지 않는 유저입니다', { code: HttpStatus.NOT_FOUND });
    message = e.short().message;
  }

  const hasEnoughBalance = raw!.balance >= pointAmount;
  if (!hasEnoughBalance) {
    const e = new BadRequestException('교환할 포인트 수량이 부족합니다', { code: HttpStatus.BAD_REQUEST });
    message = e.short().message;
  }

  logger.info({ hasEnoughBalance, raw, message });

  if (message === 'ok' && hasEnoughBalance) {
    await connection.batch([
      connection.insert(exchanges).values({ userId, elifAmount, pointAmount }),
      connection
        .update(users)
        .set({
          point: sql`${users.point} - ${pointAmount}`,
          elif: sql`ROUND(${users.elif} + ${elifAmount}, 2)`,
        })
        .where(eq(users.id, userId)),
    ]);
  }

  return message;
}
