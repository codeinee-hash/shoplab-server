import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class Category {
	@ApiProperty({ example: 'Электроника', description: 'Название категории' })
	@Prop({ required: true, unique: true })
	declare name: string

	@ApiProperty({ example: 'Смартфоны, ноутбуки, планшеты и другая электроника', description: 'Описание категории' })
	@Prop({ type: String, default: '' })
	declare description: string

	@ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL изображения категории' })
	@Prop({ type: String, default: '' })
	declare image: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
