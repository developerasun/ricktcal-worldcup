import { BRAND_NAME } from '@/constants';
import { ILoginCookiePayload } from '@/types/application';
import { AddressLike } from 'ethers';
import * as jose from 'jose';

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
}
