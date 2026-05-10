import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Request, Response } from 'express'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { CreateUserDto, LoginUserDto, UserResponseDto } from 'src/users/dto/user.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Авторизация')
@Controller('api/v1/auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'Вход в аккаунт' })
	@ApiBody({ type: LoginUserDto })
	@ApiResponse({
		status: 200,
		description: 'Успешный вход. Токены устанавливаются в cookies.',
		schema: {
			example: { status: 'success', message: 'Успешный вход' },
		},
	})
	@ApiResponse({ status: 400, description: 'Неверный логин/email или пароль' })
	@Post('/sign-in')
	async login(
		@Body() userDto: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(userDto, res)
	}

	@ApiOperation({ summary: 'Регистрация нового пользователя' })
	@UsePipes(ValidationPipe)
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({
		status: 201,
		description: 'Пользователь успешно зарегистрирован. Токены устанавливаются в cookies.',
		schema: {
			example: { status: 'success', message: 'Пользователь успешно зарегистрирован' },
		},
	})
	@ApiResponse({ status: 400, description: 'Логин или Email уже заняты / Ошибки валидации' })
	@Post('/sign-up')
	async registration(
		@Body() userDto: CreateUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.registration(userDto, res)
	}

	@ApiOperation({ summary: 'Обновить токен' })
	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'Токен успешно обновлён',
		schema: {
			example: { status: 'success', message: 'Токен обновлён' },
		},
	})
	@ApiResponse({ status: 401, description: 'Не авторизован / Токен недействителен' })
	@UseGuards(JwtAuthGuard)
	@Post('/refresh')
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.refreshToken(req, res)
	}

	@ApiOperation({ summary: 'Выход из аккаунта' })
	@ApiResponse({
		status: 200,
		description: 'Успешный выход. Cookies очищены.',
		schema: {
			example: { status: 'success', message: 'Вы вышли из аккаунта' },
		},
	})
	@Post('/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.logout(res)
	}

	@ApiOperation({ summary: 'Получить профиль текущего пользователя' })
	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'Данные профиля пользователя',
		type: UserResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Не авторизован' })
	@UseGuards(JwtAuthGuard)
	@Get('/profile')
	async getProfile(@Req() req: Request) {
		return this.authService.getProfile((req as any).user._id)
	}
}
