import { IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AutosaveDto {
  @ApiPropertyOptional({ description: 'Canvas design JSON from editor' })
  @IsOptional()
  @IsObject()
  canvasJson?: any;

  @ApiPropertyOptional({ description: 'Content fields (names, dates, messages)' })
  @IsOptional()
  @IsObject()
  contentJson?: any;
}
