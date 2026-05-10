import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { UserResponseDto } from './dto/user.dto'
import { UsersService } from './users.service'

@ApiTags('Пользователи')
@Controller('api/v1')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@ApiOperation({ summary: 'Получить всех пользователей (только Admin)' })
	@ApiResponse({
		status: 200,
		description: 'Список всех пользователей',
		type: [UserResponseDto],
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@ApiResponse({ status: 403, description: 'Доступ запрещён (только для администраторов)' })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@Get('/admin/users')
	getAll() {
		return this.usersService.getAllUsers()
	}
}
