import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (should be unique)',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email should not be longer than 100 characters' })
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'User password (minimum 8 characters, including uppercase, lowercase, number, and special character)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must not be longer than 32 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @ApiProperty({
    example: 'sam alton',
    description: 'User full name',
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Full name must not be longer than 50 characters' })
  fullname: string;
}
