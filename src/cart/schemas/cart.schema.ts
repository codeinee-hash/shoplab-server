import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

@Schema({ _id: false })
export class CartItem {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара' })
	@Prop({ type: Types.ObjectId, ref: 'Product', required: true })
	declare product: Types.ObjectId

	@ApiProperty({ example: 2, description: 'Количество' })
	@Prop({ type: Number, required: true, min: 1 })
	declare quantity: number
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem)

export type CartDocument = Cart & Document

@Schema({ timestamps: true })
export class Cart {
	@ApiProperty({ description: 'ID пользователя' })
	@Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
	declare user: Types.ObjectId

	@ApiProperty({ type: [CartItem], description: 'Товары в корзине' })
	@Prop({ type: [CartItemSchema], default: [] })
	declare items: CartItem[]
}

export const CartSchema = SchemaFactory.createForClass(Cart)
