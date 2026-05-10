import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type UserDocument = User & Document

export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
	@ApiProperty({ example: 'john_doe', description: 'Уникальный логин пользователя' })
	@Prop({ required: true, unique: true })
	declare login: string

	@ApiProperty({ example: 'john@example.com', description: 'Email пользователя' })
	@Prop({ required: true, unique: true, type: String })
	declare email: string

	@ApiProperty({ example: '******', description: 'Пароль пользователя' })
	@Prop({ required: true, type: String })
	declare password: string

	@ApiProperty({ example: 'USER', description: 'Роль пользователя', enum: UserRole })
	@Prop({ required: true, type: String, enum: UserRole, default: UserRole.USER })
	declare role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)
