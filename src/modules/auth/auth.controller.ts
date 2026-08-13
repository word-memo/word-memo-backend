import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBaseDto, RegisterBaseDto } from './dto/auth.dto';
import { TokenPair } from './types/jwt.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('base/login')
  async loginBase(@Body() loginBaseDto: LoginBaseDto): Promise<TokenPair> {
    return await this.authService.loginBase(loginBaseDto);
  }

  @Post('base/register')
  async registerBase(
    @Body() registerBaseDto: RegisterBaseDto,
  ): Promise<TokenPair> {
    return await this.authService.registerBase(registerBaseDto);
  }
}
