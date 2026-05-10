import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId } from 'class-validator'

export class AddFavoriteDto {
	@ApiProperty({ example: '665a1b2c3d4e5f6a7b8c9d0e', description: 'ID товара для добавления в избранное' })
	@IsMongoId({ message: 'Некорректный ID товара' })
	readonly productId: string
}
