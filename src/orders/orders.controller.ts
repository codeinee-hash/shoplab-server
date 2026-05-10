import {
	Body,
	Controller,
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
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { CreateOrderDto, OrderQueryDto, UpdateOrderStatusDto } from './dto/order.dto'
import { OrdersService } from './orders.service'

@ApiTags('Заказы')
@Controller('api/v1')
export class OrdersController {
	constructor(private ordersService: OrdersService) {}

	// ==================== User ====================

	@ApiOperation({ summary: 'Получить заказы текущего пользователя' })
	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'Список заказов пользователя',
		schema: {
			example: {
				status: 'success',
				data: [
					{
						_id: '665a...',
						user: '665a...',
						items: [{ product: { name: 'iPhone', price: 89990, image: '...' }, quantity: 1, price: 89990 }],
						totalPrice: 89990,
						status: 'pending',
						deliveryAddress: 'г. Бишкек',
						comment: '',
						createdAt: '2026-05-10T10:00:00Z',
					},
				],
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UseGuards(JwtAuthGuard)
	@Get('/orders')
	findUserOrders(@Req() req: Request) {
		return this.ordersService.findUserOrders((req as any).user._id)
	}

	@ApiOperation({ summary: 'Получить заказ по ID' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID заказа' })
	@ApiResponse({ status: 200, description: 'Детали заказа' })
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UseGuards(JwtAuthGuard)
	@Get('/orders/:id')
	findById(@Req() req: Request, @Param('id') id: string) {
		return this.ordersService.findById(id, (req as any).user._id)
	}

	@ApiOperation({ summary: 'Создать заказ' })
	@ApiBearerAuth()
	@ApiBody({ type: CreateOrderDto })
	@ApiResponse({ status: 201, description: 'Заказ успешно создан' })
	@ApiResponse({ status: 400, description: 'Ошибки валидации' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('/orders')
	create(@Req() req: Request, @Body() dto: CreateOrderDto) {
		return this.ordersService.create((req as any).user._id, dto)
	}

	@ApiOperation({ summary: 'Отменить свой заказ' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID заказа' })
	@ApiResponse({ status: 200, description: 'Заказ отменён' })
	@ApiResponse({ status: 400, description: 'Нельзя отменить этот заказ' })
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UseGuards(JwtAuthGuard)
	@Patch('/orders/:id/cancel')
	cancelOrder(@Req() req: Request, @Param('id') id: string) {
		return this.ordersService.cancelOrder(id, (req as any).user._id)
	}

	// ==================== Admin ====================

	@ApiOperation({
		summary: 'Получить все заказы (только Admin)',
		description: 'Возвращает все заказы с возможностью фильтрации по статусу и пагинацией',
	})
	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'Список всех заказов с пагинацией',
		schema: {
			example: {
				status: 'success',
				data: [],
				pagination: { total: 50, page: 1, limit: 10, pages: 5 },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Get('/admin/orders')
	findAllOrders(@Query() query: OrderQueryDto) {
		return this.ordersService.findAllOrders(query)
	}

	@ApiOperation({ summary: 'Обновить статус заказа (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID заказа' })
	@ApiBody({ type: UpdateOrderStatusDto })
	@ApiResponse({ status: 200, description: 'Статус заказа обновлён' })
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Patch('/admin/orders/:id/status')
	updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
		return this.ordersService.updateStatus(id, dto)
	}

	@ApiOperation({ summary: 'Получить заказ по ID (только Admin)' })
	@ApiBearerAuth()
	@ApiParam({ name: 'id', description: 'ID заказа' })
	@ApiResponse({ status: 200, description: 'Детали заказа' })
	@ApiResponse({ status: 404, description: 'Заказ не найден' })
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён' })
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Get('/admin/orders/:id')
	findAdminById(@Param('id') id: string) {
		// Передаем undefined в качестве userId, чтобы админ мог видеть любой заказ
		return this.ordersService.findById(id)
	}
}
