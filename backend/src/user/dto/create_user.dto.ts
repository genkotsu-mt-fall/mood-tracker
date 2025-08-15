import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
