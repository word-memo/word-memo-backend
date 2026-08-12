import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtTokenType } from '../types/jwt.types';
import { AuthProvider } from '@/generated/prisma/enums';

export type JwtRequestUser = {
  userId: string;
  authProvider: AuthProvider;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtRequestUser {
    if (
      payload.type !== JwtTokenType.ACCESS ||
      !payload.sub ||
      !payload.authProvider
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    return {
      userId: payload.sub,
      authProvider: payload.authProvider,
    };
  }
}
