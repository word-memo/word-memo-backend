import { AuthProvider } from '@generated/prisma/enums';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from './tokens/tokens.service';
import { JwtPayload, TokenPair } from './types/jwt.types';
import { LoginBaseDto, RefreshDto, RegisterBaseDto } from './dto/auth.dto';
import { UsersService } from '@/modules/users/users.service';
import * as bcrypt from 'bcrypt';

type CreateTokenPairInput = {
  userId: string;
  authProvider: AuthProvider;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UsersService,
  ) {}

  async registerBase(registerBaseDto: RegisterBaseDto): Promise<TokenPair> {
    const { email, password } = registerBaseDto;

    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.userService.createUser({
      email,
      password,
      authProvider: AuthProvider.base,
    });

    return await this.createTokenPair({
      userId: newUser.id,
      authProvider: newUser.authProvider,
    });
  }

  async loginBase(loginBaseDto: LoginBaseDto): Promise<TokenPair> {
    const { email, password } = loginBaseDto;

    const user = await this.userService.findUserByEmail(email);

    // TODO: Combine this handlers
    if (user && user.authProvider !== AuthProvider.base) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.createTokenPair({
      userId: user.id,
      authProvider: user.authProvider,
    });
  }

  async refresh({ refreshToken }: RefreshDto): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);
    return await this.createTokenPair({
      userId: payload.sub,
      authProvider: payload.authProvider,
    });
  }

  private async createTokenPair(
    input: CreateTokenPairInput,
  ): Promise<TokenPair> {
    return await this.tokensService.createTokenPair(input);
  }

  private async verifyAccessToken(token: string): Promise<JwtPayload> {
    return await this.tokensService.verifyAccessToken(token);
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return await this.tokensService.verifyRefreshToken(token);
  }
}
