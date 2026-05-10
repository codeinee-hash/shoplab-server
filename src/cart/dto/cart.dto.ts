import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNumber, Min } from 'class-validator'

export class AddToCartDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара' })
	@IsMongoId({ message: 'Некорректный ID товара' })
	readonly productId: string

	@ApiProperty({ example: 1, description: 'Количество (минимум 1)' })
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(1, { message: 'Минимальное количество — 1' })
	readonly quantity: number
}

export class UpdateCartItemDto {
	@ApiProperty({ example: 3, description: 'Новое количество товара' })
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(1, { message: 'Минимальное количество — 1' })
	readonly quantity: number
}
