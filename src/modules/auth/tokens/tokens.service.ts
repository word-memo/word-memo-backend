import { AuthProvider } from '@generated/prisma/enums';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { JwtPayload, JwtTokenType, TokenPair } from '../types/jwt.types';

type CreateTokenInput = {
  userId: string;
  authProvider: AuthProvider;
};

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(input: CreateTokenInput): Promise<string> {
    return this.signToken(input, JwtTokenType.ACCESS);
  }

  async createRefreshToken(input: CreateTokenInput): Promise<string> {
    return this.signToken(input, JwtTokenType.REFRESH);
  }

  async createTokenPair(input: CreateTokenInput): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(input),
      this.createRefreshToken(input),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.verifyToken(token, JwtTokenType.ACCESS);
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.verifyToken(token, JwtTokenType.REFRESH);
  }

  private async signToken(
    input: CreateTokenInput,
    type: JwtTokenType,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: input.userId,
      authProvider: input.authProvider,
      type,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.getSecret(type),
      expiresIn: this.getExpiresIn(type),
    });
  }

  private async verifyToken(
    token: string,
    expectedType: JwtTokenType,
  ): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.getSecret(expectedType),
      });

      if (payload.type !== expectedType) {
        throw new UnauthorizedException('Invalid token type');
      }

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getSecret(type: JwtTokenType): string {
    return type === JwtTokenType.ACCESS
      ? this.configService.getOrThrow<string>('JWT_ACCESS_SECRET')
      : this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private getExpiresIn(type: JwtTokenType): StringValue {
    return type === JwtTokenType.ACCESS
      ? this.configService.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN')
      : this.configService.getOrThrow<StringValue>('JWT_REFRESH_EXPIRES_IN');
  }
}
