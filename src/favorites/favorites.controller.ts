import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	UsePipes,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { FavoritesService } from './favorites.service'
import { AddFavoriteDto } from './dto/favorites.dto'

@ApiTags('Избранное')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/favorites')
export class FavoritesController {
	constructor(private favoritesService: FavoritesService) {}

	@ApiOperation({ summary: 'Получить избранное текущего пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Список избранных товаров',
		schema: {
			example: {
				status: 'success',
				data: {
					_id: '665a...',
					user: '665a...',
					products: [
						{ _id: '665a...', name: 'iPhone 15 Pro', price: 89990, image: 'https://...', stock: 50 },
					],
				},
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Get()
	getFavorites(@Req() req: Request) {
		return this.favoritesService.getFavorites((req as any).user._id)
	}

	@ApiOperation({ summary: 'Добавить товар в избранное' })
	@ApiBody({ type: AddFavoriteDto })
	@ApiResponse({ status: 201, description: 'Товар добавлен в избранное' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UsePipes(ValidationPipe)
	@Post()
	addToFavorites(@Req() req: Request, @Body() dto: AddFavoriteDto) {
		return this.favoritesService.addToFavorites((req as any).user._id, dto)
	}

	@ApiOperation({ summary: 'Удалить товар из избранного' })
	@ApiParam({ name: 'productId', description: 'ID товара' })
	@ApiResponse({ status: 200, description: 'Товар удалён из избранного' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Delete(':productId')
	removeFromFavorites(@Req() req: Request, @Param('productId') productId: string) {
		return this.favoritesService.removeFromFavorites((req as any).user._id, productId)
	}
}
