import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

export enum OrderStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class OrderItem {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара' })
	@Prop({ type: Types.ObjectId, ref: 'Product', required: true })
	declare product: Types.ObjectId

	@ApiProperty({ example: 2, description: 'Количество' })
	@Prop({ type: Number, required: true, min: 1 })
	declare quantity: number

	@ApiProperty({ example: 89990, description: 'Цена на момент заказа' })
	@Prop({ type: Number, required: true })
	declare price: number
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)

export type OrderDocument = Order & Document

@Schema({ timestamps: true })
export class Order {
	@ApiProperty({ description: 'ID пользователя' })
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	declare user: Types.ObjectId

	@ApiProperty({ type: [OrderItem], description: 'Товары в заказе' })
	@Prop({ type: [OrderItemSchema], required: true })
	declare items: OrderItem[]

	@ApiProperty({ example: 179980, description: 'Итоговая сумма заказа' })
	@Prop({ type: Number, required: true })
	declare totalPrice: number

	@ApiProperty({ example: 'pending', description: 'Статус заказа', enum: OrderStatus })
	@Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
	declare status: OrderStatus

	@ApiProperty({ example: 'г. Бишкек, ул. Киевская 120', description: 'Адрес доставки' })
	@Prop({ type: String, required: true })
	declare deliveryAddress: string

	@ApiProperty({ example: 'Позвонить за час до доставки', description: 'Комментарий к заказу' })
	@Prop({ type: String, default: '' })
	declare comment: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
