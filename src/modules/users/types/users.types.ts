import { AuthProvider } from '@/generated/prisma/enums';

export type CreateUserData = {
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string | null;
  firstName?: string;
  lastName?: string;
};
