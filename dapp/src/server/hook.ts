import { BRAND_NAME, COOKIE_NAME } from '@/constants';
import { ILoginCookiePayload } from '@/types/application';
import { eq } from 'drizzle-orm';
import { AddressLike, concat, keccak256, toUtf8Bytes, verifyMessage, Wallet } from 'ethers';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { getConnection, users } from './database/schema';
import { UnAuthorizedException } from './error';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export class AuthManager {
  #issuer = BRAND_NAME.project;
  #audience = BRAND_NAME.audience;
  #deadline = '2h';

  async _useTokenEncryption({ wallet }: { wallet: AddressLike }) {
    const { COOKIE_SECRET } = process.env;
    if (!COOKIE_SECRET) throw new Error(`_useEncryption: invalid dotenv value for COOKIE_SECRET`);

    const secret = new TextEncoder().encode(COOKIE_SECRET);
    const alg = 'HS256';

    const payload: ILoginCookiePayload = {
      wallet,
    };
    const token = await new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(this.#issuer)
      .setAudience(this.#audience)
      .setExpirationTime(this.#deadline)
      .sign(secret);

    return { token };
  }

  async _useTokenVerify({
    token,
  }: {
    token: string;
  }): Promise<{ payload: (jose.JWTPayload & ILoginCookiePayload) | null }> {
    const { COOKIE_SECRET } = process.env;
    if (!COOKIE_SECRET) throw new Error(`_useTokenVerify: invalid dotenv value for COOKIE_SECRET`);

    const secret = new TextEncoder().encode(COOKIE_SECRET);
    let isSuccess = false;
    let payload: (jose.JWTPayload & ILoginCookiePayload) | null = null;

    try {
      const verified = await jose.jwtVerify(token, secret, {
        issuer: this.#issuer,
        audience: this.#audience,
      });

      isSuccess = true;
      payload = verified.payload as jose.JWTPayload & ILoginCookiePayload;
    } catch (error) {
      const message = JSON.stringify(error);
      console.error(message);
    } finally {
      return { payload };
    }
  }

  async _useDigitalSignature({ mnemonic, message }: { mnemonic: string; message: string }) {
    const recovered = Wallet.fromPhrase(mnemonic);
    const signature = await recovered.signMessage(message);

    return { signature };
  }

  async _useVerification({ message, signature }: { message: string; signature: string }) {
    const realSigner = verifyMessage(message, signature);
    return { realSigner };
  }
}

export async function validateAndFindIdentity(cookie?: RequestCookie) {
  let auth = (await cookies()).get(COOKIE_NAME.auth);

  // @dev rsc-compatible
  if (cookie) auth = cookie;

  if (!auth) throw new UnAuthorizedException();
  const token = auth.value;
  const am = new AuthManager();
  const { payload } = await am._useTokenVerify({ token });

  if (!payload) throw new UnAuthorizedException();
  const wallet = payload.wallet.toString();

  const { connection } = await getConnection();
  const hasUser = await connection.select().from(users).where(eq(users.wallet, wallet)).get();

  if (!hasUser) throw new UnAuthorizedException();

  const { id: userId, point, elif, nickname } = hasUser;

  return { userId, wallet, point, elif, nickname };
}

/**
 *
 * @returns keep consistent tz, cf worker tz might be different
 */
export function getKoreanTimezone() {
  return new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });
}

/**
 * @dev UTC → KST 수동 변환
 * @dev convert kst to utc in `full:yyyy-mm-dd hh:mm;ss` and `short:yyyy-mm-dd` format
 */
export function fromUTC() {
  const date = new Date();
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const full = kstDate.toISOString().replace('T', ' ').slice(0, 19);
  const short = full.slice(0, 10);

  return { full, short };
}

/**
 *
 * @param target number to display decimals points
 * @param precision how many decimals, default is 2
 * @returns e.g 3.14, number
 */
export function toDecimal(target: number, precision: number = 2): number {
  const points = 10 ** precision;
  return Math.round(target * points) / points;
}

/**
 *
 * @dev convert original message to be a eip-191-compatible digest
 * @returns
 */
export function toEthSignedMessageHash(message: string) {
  const messageBytes = toUtf8Bytes(message);
  const prefix = `\x19Ethereum Signed Message:\n${messageBytes.length}`;
  const prefixBytes = toUtf8Bytes(prefix);
  const digest = keccak256(concat([prefixBytes, messageBytes]));

  return { digest };
}

export function getExponentialBackOff({ baseDelay, attempt }: { baseDelay: number; attempt: number }) {
  const timegap = baseDelay + baseDelay * Math.pow(2, attempt);
  return { timegap };
}
