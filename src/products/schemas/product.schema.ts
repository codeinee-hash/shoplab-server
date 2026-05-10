import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
	@ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
	@Prop({ required: true })
	declare name: string

	@ApiProperty({ example: 'Флагманский смартфон Apple с чипом A17 Pro', description: 'Описание товара' })
	@Prop({ type: String, default: '' })
	declare description: string

	@ApiProperty({ example: 89990, description: 'Цена товара' })
	@Prop({ required: true, type: Number })
	declare price: number

	@ApiProperty({ example: 'https://example.com/iphone.jpg', description: 'URL изображения товара' })
	@Prop({ type: String, default: '' })
	declare image: string

	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID категории товара' })
	@Prop({ type: Types.ObjectId, ref: 'Category', required: true })
	declare category: Types.ObjectId

	@ApiProperty({ example: 50, description: 'Количество на складе' })
	@Prop({ type: Number, default: 0 })
	declare stock: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
