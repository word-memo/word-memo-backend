import { User } from '@/generated/prisma/client';
import { AuthProvider } from '@/generated/prisma/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/users.dto';
import { UsersRepository } from './users.repository';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, authProvider, email, firstName, lastName } =
      createUserDto;

    let passwordHash: string | null = null;

    if (authProvider === AuthProvider.base) {
      if (!password) {
        throw new BadRequestException(
          'Password is required for base authentication',
        );
      }

      passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    } else if (password) {
      throw new BadRequestException(
        'Password is not allowed for OAuth authentication',
      );
    }

    return this.usersRepository.createUser({
      email,
      authProvider,
      passwordHash,
      firstName,
      lastName,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.usersRepository.findUserById(userId);
  }
}
