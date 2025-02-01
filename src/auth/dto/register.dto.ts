import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newSecurePassword!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsString()
  role?: string; // "user" | "admin"
}
