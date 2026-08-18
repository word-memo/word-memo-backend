import type { User } from '@/generated/prisma/client';
import { AuthProvider } from '@/generated/prisma/enums';

export class UserResponseDto {
  id: string;
  email: string | null;
  authProvider: AuthProvider;
  firstName: string | null;
  lastName: string | null;

  static from(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      authProvider: user.authProvider,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
