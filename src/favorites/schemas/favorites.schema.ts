import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

export type FavoritesDocument = Favorites & Document

@Schema({ timestamps: true })
export class Favorites {
	@ApiProperty({ description: 'ID пользователя' })
	@Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
	declare user: Types.ObjectId

	@ApiProperty({ description: 'Список избранных товаров', type: [String] })
	@Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
	declare products: Types.ObjectId[]
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites)
