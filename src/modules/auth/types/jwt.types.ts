export enum JwtTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export type JwtPayload = {
  sub: string;
  type: JwtTokenType;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
