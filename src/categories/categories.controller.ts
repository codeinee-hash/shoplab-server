import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
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
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { CategoriesService } from './categories.service'
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto'

@ApiTags('Категории')
@Controller('api/v1')
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	// ==================== Public ====================

	@ApiOperation({ summary: 'Получить все категории' })
	@ApiResponse({
		status: 200,
		description: 'Список всех категорий',
		schema: {
			example: {
				status: 'success',
				data: [
					{ _id: '665a...', name: 'Электроника', description: 'Техника', image: 'https://...' },
				],
			},
		},
	})
	@Get('/categories')
	findAll() {
		return this.categoriesService.findAll()
	}

	@ApiOperation({ summary: 'Получить категорию по ID' })
	@ApiParam({ name: 'id', description: 'ID категории', example: '665a1b2c3d4e5f6a7b8c9d0e' })
	@ApiResponse({ status: 200, description: 'Данные категории', type: CategoryResponseDto })
	@ApiResponse({ status: 404, description: 'Категория не найдена' })
	@Get('/categories/:id')
	findById(@Param('id') id: string) {
		return this.categoriesService.findById(id)
	}

	// ==================== Admin ====================

	@ApiOperation({ summary: 'Создать категорию (только Admin)' })
	@ApiBearerAuth()
	@ApiBody({ type: CreateCategoryDto })
	@ApiResponse({
		status: 201,
		description: 'Категория успешно создана',
		type: CategoryResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Категория с таким названием уже существует' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Post('/admin/categories')
	create(@Body() dto: CreateCategoryDto) {
		return this.categoriesService.create(dto)
	}

	@ApiOperation({ summary: 'Обновить категорию (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID категории' })
	@ApiBody({ type: UpdateCategoryDto })
	@ApiResponse({ status: 200, description: 'Категория обновлена', type: CategoryResponseDto })
	@ApiResponse({ status: 404, description: 'Категория не найдена' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Patch('/admin/categories/:id')
	update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.categoriesService.update(id, dto)
	}

	@ApiOperation({ summary: 'Удалить категорию (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID категории' })
	@ApiResponse({ status: 200, description: 'Категория удалена' })
	@ApiResponse({ status: 404, description: 'Категория не найдена' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Delete('/admin/categories/:id')
	delete(@Param('id') id: string) {
		return this.categoriesService.delete(id)
	}
}
