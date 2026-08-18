import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtRequestUser } from '@/modules/auth/types/jwt.types';
import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() currentUser: JwtRequestUser,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findUserById(currentUser.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseDto.from(user);
  }
}
