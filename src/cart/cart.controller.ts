import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
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
import { CartService } from './cart.service'
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto'

@ApiTags('Корзина')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/cart')
export class CartController {
	constructor(private cartService: CartService) {}

	@ApiOperation({ summary: 'Получить корзину текущего пользователя' })
	@ApiResponse({
		status: 200,
		description: 'Корзина пользователя с товарами',
		schema: {
			example: {
				status: 'success',
				data: {
					_id: '665a...',
					user: '665a...',
					items: [
						{
							product: { _id: '665a...', name: 'iPhone 15 Pro', price: 89990, image: 'https://...' },
							quantity: 2,
						},
					],
				},
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Get()
	getCart(@Req() req: Request) {
		return this.cartService.getCart((req as any).user._id)
	}

	@ApiOperation({ summary: 'Добавить товар в корзину' })
	@ApiBody({ type: AddToCartDto })
	@ApiResponse({ status: 201, description: 'Товар добавлен в корзину' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UsePipes(ValidationPipe)
	@Post()
	addItem(@Req() req: Request, @Body() dto: AddToCartDto) {
		return this.cartService.addItem((req as any).user._id, dto)
	}

	@ApiOperation({ summary: 'Обновить количество товара в корзине' })
	@ApiParam({ name: 'productId', description: 'ID товара в корзине' })
	@ApiBody({ type: UpdateCartItemDto })
	@ApiResponse({ status: 200, description: 'Количество обновлено' })
	@ApiResponse({ status: 404, description: 'Товар не найден в корзине' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Patch(':productId')
	updateItem(
		@Req() req: Request,
		@Param('productId') productId: string,
		@Body() dto: UpdateCartItemDto,
	) {
		return this.cartService.updateItem((req as any).user._id, productId, dto)
	}

	@ApiOperation({ summary: 'Удалить товар из корзины' })
	@ApiParam({ name: 'productId', description: 'ID товара' })
	@ApiResponse({ status: 200, description: 'Товар удалён из корзины' })
	@ApiResponse({ status: 404, description: 'Товар не найден в корзине' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Delete(':productId')
	removeItem(@Req() req: Request, @Param('productId') productId: string) {
		return this.cartService.removeItem((req as any).user._id, productId)
	}

	@ApiOperation({ summary: 'Очистить корзину' })
	@ApiResponse({ status: 200, description: 'Корзина очищена' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@Delete()
	clearCart(@Req() req: Request) {
		return this.cartService.clearCart((req as any).user._id)
	}
}
