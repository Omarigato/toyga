import { IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpRequestDto {
  @ApiProperty({ example: '+77001234567', description: 'Phone number in international format' })
  @IsString()
  @MinLength(10, { message: 'Phone number is too short' })
  @MaxLength(15, { message: 'Phone number is too long' })
  @Matches(/^\+?[78]\d{10}$/, { message: 'Invalid phone number format. Use +7XXXXXXXXXX' })
  phone: string;
}
