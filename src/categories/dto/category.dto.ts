import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
	@ApiProperty({ example: 'Электроника', description: 'Название категории' })
	@IsString({ message: 'Название должно быть строкой' })
	readonly name: string

	@ApiPropertyOptional({ example: 'Смартфоны, ноутбуки и другая техника', description: 'Описание категории' })
	@IsOptional()
	@IsString({ message: 'Описание должно быть строкой' })
	readonly description?: string

	@ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'URL изображения' })
	@IsOptional()
	@IsString({ message: 'URL изображения должен быть строкой' })
	readonly image?: string
}

export class UpdateCategoryDto {
	@ApiPropertyOptional({ example: 'Электроника', description: 'Название категории' })
	@IsOptional()
	@IsString({ message: 'Название должно быть строкой' })
	readonly name?: string

	@ApiPropertyOptional({ example: 'Обновлённое описание', description: 'Описание категории' })
	@IsOptional()
	@IsString({ message: 'Описание должно быть строкой' })
	readonly description?: string

	@ApiPropertyOptional({ example: 'https://example.com/new-image.jpg', description: 'URL изображения' })
	@IsOptional()
	@IsString({ message: 'URL изображения должен быть строкой' })
	readonly image?: string
}

export class CategoryResponseDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID категории' })
	_id: string

	@ApiProperty({ example: 'Электроника', description: 'Название' })
	name: string

	@ApiProperty({ example: 'Смартфоны, ноутбуки', description: 'Описание' })
	description: string

	@ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения' })
	image: string
}
