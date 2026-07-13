import { IsArray, IsString, ValidateNested, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GuestImportItem {
  @ApiProperty({ example: 'Aigerim' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '+77001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'aigerim@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Dear Aigerim!' })
  @IsOptional()
  @IsString()
  customMessage?: string;
}

export class BulkImportGuestsDto {
  @ApiProperty({ description: 'Event UUID' })
  @IsString()
  eventId: string;

  @ApiProperty({ type: [GuestImportItem], description: 'Array of guests to import (max 1000)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestImportItem)
  guests: GuestImportItem[];
}
