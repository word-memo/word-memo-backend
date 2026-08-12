import { Injectable } from '@nestjs/common';
import { TokensService } from './tokens/tokens.service';
import { JwtPayload, TokenPair } from './types/jwt.types';

@Injectable()
export class AuthService {
  constructor(private readonly tokensService: TokensService) {}

  private async createTokenPair(userId: string): Promise<TokenPair> {
    return await this.tokensService.createTokenPair(userId);
  }

  private async verifyAccessToken(token: string): Promise<JwtPayload> {
    return await this.tokensService.verifyAccessToken(token);
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return await this.tokensService.verifyRefreshToken(token);
  }
}
