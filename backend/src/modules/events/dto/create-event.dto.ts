import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Template UUID to use' })
  @IsString()
  templateId: string;

  @ApiProperty({ example: 'Omar & Marjan Wedding' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'wedding', enum: ['wedding', 'kyz-uzatu', 'sundet', 'birthday', 'anniversary', 'corporate', 'baby-shower', 'other'] })
  @IsString()
  eventType: string;

  @ApiProperty({ example: '2026-08-15T16:00:00+06:00' })
  @IsString()
  eventDate: string;

  @ApiPropertyOptional({ example: 'Restaurant Bishkek, 15 Sayakbayev St' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
