import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
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
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import {
	CreateProductDto,
	ProductQueryDto,
	ProductResponseDto,
	UpdateProductDto,
} from './dto/product.dto'
import { ProductsService } from './products.service'

@ApiTags('Товары')
@Controller('api/v1')
export class ProductsController {
	constructor(private productsService: ProductsService) {}

	// ==================== Public ====================

	@ApiOperation({
		summary: 'Получить список товаров',
		description: 'Возвращает список товаров с поддержкой поиска, фильтрации по категории, диапазону цен, сортировки и пагинации. Все параметры опциональны.',
	})
	@ApiResponse({
		status: 200,
		description: 'Список товаров с пагинацией',
		schema: {
			example: {
				status: 'success',
				data: [
					{
						_id: '665a...',
						name: 'iPhone 15 Pro',
						description: 'Флагманский смартфон',
						price: 89990,
						image: 'https://...',
						category: { _id: '665a...', name: 'Электроника' },
						stock: 50,
					},
				],
				pagination: { total: 25, page: 1, limit: 10, pages: 3 },
			},
		},
	})
	@UseGuards(OptionalJwtAuthGuard)
	@Get('/products')
	findAll(@Query() query: ProductQueryDto, @Req() req: Request) {
		const userId = (req as any).user?._id
		return this.productsService.findAll(query, userId)
	}

	@ApiOperation({ summary: 'Получить товар по ID' })
	@ApiParam({ name: 'id', description: 'ID товара', example: '665a1b2c3d4e5f6a7b8c9d0e' })
	@ApiResponse({ status: 200, description: 'Данные товара', type: ProductResponseDto })
	@ApiResponse({ status: 404, description: 'Товар не найден' })
	@UseGuards(OptionalJwtAuthGuard)
	@Get('/products/:id')
	findById(@Param('id') id: string, @Req() req: Request) {
		const userId = (req as any).user?._id
		return this.productsService.findById(id, userId)
	}

	// ==================== Admin ====================

	@ApiOperation({ summary: 'Создать товар (только Admin)' })
	@ApiBearerAuth()
	@ApiBody({ type: CreateProductDto })
	@ApiResponse({ status: 201, description: 'Товар успешно создан', type: ProductResponseDto })
	@ApiResponse({ status: 400, description: 'Ошибки валидации' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Post('/admin/products')
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto)
	}

	@ApiOperation({ summary: 'Обновить товар (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID товара' })
	@ApiBody({ type: UpdateProductDto })
	@ApiResponse({ status: 200, description: 'Товар обновлён', type: ProductResponseDto })
	@ApiResponse({ status: 404, description: 'Товар не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Patch('/admin/products/:id')
	update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productsService.update(id, dto)
	}

	@ApiOperation({ summary: 'Удалить товар (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID товара' })
	@ApiResponse({ status: 200, description: 'Товар удалён' })
	@ApiResponse({ status: 404, description: 'Товар не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Delete('/admin/products/:id')
	delete(@Param('id') id: string) {
		return this.productsService.delete(id)
	}
}
