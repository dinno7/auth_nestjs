type TokenPayload = {
  id: string;
  iat: string;
  exp: string;
  aud?: string;
  iss?: string;
};

export type AccessTokenPayload = TokenPayload & { type: 'access' };
export type RefreshTokenPayload = TokenPayload & {
  type: 'refresh';
  tokenId: string;
};
