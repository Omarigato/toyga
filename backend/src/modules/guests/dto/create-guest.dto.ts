import { IsString, IsOptional, MinLength, MaxLength, Matches, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({ description: 'Event UUID' })
  @IsString()
  eventId: string;

  @ApiProperty({ example: 'Aigerim' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: '+77001234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[78]\d{10}$/, { message: 'Invalid phone number' })
  phone?: string;

  @ApiPropertyOptional({ example: 'aigerim@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '@aigerim', description: 'Telegram username' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  telegramUsername?: string;

  @ApiPropertyOptional({ description: 'Group key for families/couples' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupKey?: string;

  @ApiPropertyOptional({ enum: ['primary', 'secondary'], default: 'primary' })
  @IsOptional()
  @IsString()
  @IsIn(['primary', 'secondary'])
  groupRole?: string;

  @ApiPropertyOptional({ description: 'Partner guest UUID' })
  @IsOptional()
  @IsString()
  partnerGuestId?: string;

  @ApiPropertyOptional({ example: 'Dear Aigerim, you are invited!' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  customMessage?: string;
}
