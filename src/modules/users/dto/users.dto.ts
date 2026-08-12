import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProvider } from '@generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  @ApiProperty()
  authProvider: AuthProvider;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName?: string;
}
