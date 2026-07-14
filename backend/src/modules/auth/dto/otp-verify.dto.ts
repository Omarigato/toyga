import { IsString, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OtpVerifyDto {
  @ApiProperty({ example: '+77001234567' })
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^\+?[78]\d{10}$/, { message: 'Invalid phone number format' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiPropertyOptional({ example: 'Akim', description: 'Required for first-time registration' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;
}
