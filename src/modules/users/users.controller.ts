import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AppException } from '@/common/errors/app.exception';
import { ErrorCodes } from '@/common/errors/error-codes';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtRequestUser } from '@/modules/auth/types/jwt.types';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() currentUser: JwtRequestUser,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findUserById(currentUser.userId);

    if (!user) {
      throw new AppException(ErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return UserResponseDto.from(user);
  }
}
