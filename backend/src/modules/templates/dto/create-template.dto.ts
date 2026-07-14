import { IsString, IsOptional, IsBoolean, IsObject, IsNumber, MinLength, MaxLength, Matches, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty({ description: 'Category UUID' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Wedding Gold' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'wedding-gold' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'Canvas design JSON with blocks, positions, fonts' })
  @IsOptional()
  @IsObject()
  canvasJson?: any;

  @ApiPropertyOptional({ description: 'Animation timeline config' })
  @IsOptional()
  @IsObject()
  animationConfig?: any;

  @ApiPropertyOptional({ description: 'Design tokens: colors, fonts, spacing' })
  @IsOptional()
  @IsObject()
  designTokens?: any;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  @IsOptional()
  @IsString()
  status?: string;

  // V3: Marketplace fields
  @ApiPropertyOptional({ enum: ['original', 'cloned', 'imported'], default: 'original', description: 'Template source' })
  @IsOptional()
  @IsString()
  @IsIn(['original', 'cloned', 'imported'])
  source?: string;

  @ApiPropertyOptional({ description: 'Original template ID (for clones)', minimum: 0 })
  @IsOptional()
  @IsString()
  originalTemplateId?: string;

  @ApiPropertyOptional({ description: 'Price in KZT (0 = free)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  priceKzt?: number;
}
