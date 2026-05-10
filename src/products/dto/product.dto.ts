import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateProductDto {
	@ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
	@IsString({ message: 'Название должно быть строкой' })
	readonly name: string

	@ApiPropertyOptional({ example: 'Флагманский смартфон', description: 'Описание товара' })
	@IsOptional()
	@IsString({ message: 'Описание должно быть строкой' })
	readonly description?: string

	@ApiProperty({ example: 89990, description: 'Цена товара' })
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	readonly price: number

	@ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'URL изображения' })
	@IsOptional()
	@IsString({ message: 'URL изображения должен быть строкой' })
	readonly image?: string

	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID категории' })
	@IsMongoId({ message: 'Некорректный ID категории' })
	readonly category: string

	@ApiPropertyOptional({ example: 50, description: 'Количество на складе' })
	@IsOptional()
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество не может быть отрицательным' })
	readonly stock?: number
}

export class UpdateProductDto {
	@ApiPropertyOptional({ example: 'iPhone 15 Pro Max', description: 'Название товара' })
	@IsOptional()
	@IsString({ message: 'Название должно быть строкой' })
	readonly name?: string

	@ApiPropertyOptional({ example: 'Обновлённое описание', description: 'Описание товара' })
	@IsOptional()
	@IsString({ message: 'Описание должно быть строкой' })
	readonly description?: string

	@ApiPropertyOptional({ example: 99990, description: 'Цена товара' })
	@IsOptional()
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	readonly price?: number

	@ApiPropertyOptional({ example: 'https://example.com/new.jpg', description: 'URL изображения' })
	@IsOptional()
	@IsString({ message: 'URL изображения должен быть строкой' })
	readonly image?: string

	@ApiPropertyOptional({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID категории' })
	@IsOptional()
	@IsMongoId({ message: 'Некорректный ID категории' })
	readonly category?: string

	@ApiPropertyOptional({ example: 100, description: 'Количество на складе' })
	@IsOptional()
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество не может быть отрицательным' })
	readonly stock?: number
}

export class ProductQueryDto {
	@ApiPropertyOptional({ example: 'iPhone', description: 'Поиск по названию товара (регистронезависимый)' })
	@IsOptional()
	@IsString()
	readonly search?: string

	@ApiPropertyOptional({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'Фильтр по ID категории' })
	@IsOptional()
	@IsString()
	readonly category?: string

	@ApiPropertyOptional({ example: 1000, description: 'Минимальная цена' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly minPrice?: number

	@ApiPropertyOptional({ example: 100000, description: 'Максимальная цена' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly maxPrice?: number

	@ApiPropertyOptional({ example: 'price', description: 'Поле сортировки (price, name, createdAt)', enum: ['price', 'name', 'createdAt'] })
	@IsOptional()
	@IsString()
	readonly sortBy?: string

	@ApiPropertyOptional({ example: 'asc', description: 'Направление сортировки', enum: ['asc', 'desc'] })
	@IsOptional()
	@IsString()
	readonly order?: 'asc' | 'desc'

	@ApiPropertyOptional({ example: 1, description: 'Номер страницы (по умолчанию 1)' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly page?: number

	@ApiPropertyOptional({ example: 10, description: 'Количество товаров на странице (по умолчанию 10)' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly limit?: number
}

export class ProductResponseDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара' })
	_id: string

	@ApiProperty({ example: 'iPhone 15 Pro', description: 'Название' })
	name: string

	@ApiProperty({ example: 'Флагманский смартфон', description: 'Описание' })
	description: string

	@ApiProperty({ example: 89990, description: 'Цена' })
	price: number

	@ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения' })
	image: string

	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID категории' })
	category: string

	@ApiProperty({ example: 50, description: 'Количество на складе' })
	stock: number
}
