import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator'
import { OrderStatus } from '../schemas/order.schema'

export class OrderItemDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара' })
	@IsMongoId({ message: 'Некорректный ID товара' })
	readonly productId: string

	@ApiProperty({ example: 2, description: 'Количество' })
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(1, { message: 'Минимальное количество — 1' })
	readonly quantity: number

	@ApiProperty({ example: 89990, description: 'Цена товара на момент заказа' })
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	readonly price: number
}

export class CreateOrderDto {
	@ApiProperty({
		type: [OrderItemDto],
		description: 'Список товаров в заказе',
		example: [
			{ productId: '665a1b2c3d4e5f6a7b8c9d0e', quantity: 2, price: 89990 },
		],
	})
	@IsArray({ message: 'Товары должны быть массивом' })
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	readonly items: OrderItemDto[]

	@ApiProperty({ example: 'г. Бишкек, ул. Киевская 120', description: 'Адрес доставки' })
	@IsString({ message: 'Адрес должен быть строкой' })
	readonly deliveryAddress: string

	@ApiPropertyOptional({ example: 'Позвонить за час', description: 'Комментарий к заказу' })
	@IsOptional()
	@IsString({ message: 'Комментарий должен быть строкой' })
	readonly comment?: string
}

export class UpdateOrderStatusDto {
	@ApiProperty({
		example: 'processing',
		description: 'Новый статус заказа',
		enum: OrderStatus,
	})
	@IsEnum(OrderStatus, { message: 'Некорректный статус заказа. Допустимые: pending, processing, shipped, delivered, cancelled' })
	readonly status: OrderStatus
}

export class OrderQueryDto {
	@ApiPropertyOptional({
		example: 'pending',
		description: 'Фильтр по статусу заказа',
		enum: OrderStatus,
	})
	@IsOptional()
	@IsEnum(OrderStatus, { message: 'Некорректный статус' })
	readonly status?: OrderStatus

	@ApiPropertyOptional({ example: 1, description: 'Номер страницы (по умолчанию 1)' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly page?: number

	@ApiPropertyOptional({ example: 10, description: 'Количество на странице (по умолчанию 10)' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	readonly limit?: number
}
