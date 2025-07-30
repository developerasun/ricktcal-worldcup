import { BRAND_NAME, COOKIE_NAME } from '@/constants';
import { ILoginCookiePayload } from '@/types/application';
import { eq } from 'drizzle-orm';
import { AddressLike, Signature, verifyMessage, Wallet } from 'ethers';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { getConnection, users } from './database/schema';
import { UnauthorizedException } from './error';

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

export async function validateAndFindIdentity() {
  const auth = (await cookies()).get(COOKIE_NAME.auth);

  if (!auth) throw new UnauthorizedException();
  const token = auth.value;
  const am = new AuthManager();
  const { payload } = await am._useTokenVerify({ token });

  if (!payload) throw new UnauthorizedException();
  const wallet = payload.wallet.toString();

  const { connection } = await getConnection();
  const hasUser = await connection.select().from(users).where(eq(users.wallet, wallet)).get();

  if (!hasUser) throw new UnauthorizedException();

  const { id: userId } = hasUser;

  return { userId, wallet };
}
