import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@ApiProperty({ example: 'john_doe', description: 'Логин пользователя' })
	@IsString({ message: 'Логин должен быть строкой' })
	readonly login: string

	@ApiProperty({ example: 'john@example.com', description: 'Email пользователя' })
	@IsEmail({}, { message: 'Некорректный email' })
	readonly email: string

	@ApiProperty({ example: 'qwerty123', description: 'Пароль (минимум 6 символов)' })
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
	readonly password: string
}

export class LoginUserDto {
	@ApiProperty({
		example: 'john_doe',
		description: 'Логин или Email пользователя',
	})
	@IsString({ message: 'Должно быть строкой' })
	readonly loginOrEmail: string

	@ApiProperty({ example: 'qwerty123', description: 'Пароль' })
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
	readonly password: string
}

export class UserResponseDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID пользователя' })
	_id: string

	@ApiProperty({ example: 'john_doe', description: 'Логин' })
	login: string

	@ApiProperty({ example: 'john@example.com', description: 'Email' })
	email: string

	@ApiProperty({ example: 'USER', description: 'Роль пользователя' })
	role: string
}
