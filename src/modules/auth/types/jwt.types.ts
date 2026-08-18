import { AuthProvider } from '@generated/prisma/enums';

export enum JwtTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export type JwtPayload = {
  sub: string;
  type: JwtTokenType;
  authProvider: AuthProvider;
};

export type JwtRequestUser = {
  userId: string;
  authProvider: AuthProvider;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
