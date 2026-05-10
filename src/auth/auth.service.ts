import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { CreateUserDto, LoginUserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/users.service'
import { TokensService, TokenType } from './token.service'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private tokensService: TokensService
	) {}

	async login(userDto: LoginUserDto, res: Response) {
		const user = await this.validateUser(userDto)
		const { accessToken, refreshToken } = this.tokensService.generateTokens({
			_id: user?._id?.toString(),
			login: user.login,
			email: user.email,
			role: user.role,
		})

		this.tokensService.setRefreshTokenCookie(
			res,
			TokenType.REFRESH,
			refreshToken
		)
		this.tokensService.setRefreshTokenCookie(res, TokenType.ACCESS, accessToken)

		return {
			status: 'success',
			message: 'Успешный вход',
			accessToken,
		}
	}

	async registration(userDto: CreateUserDto, res: Response) {
		const candidateByLogin = await this.usersService.getUserByLogin(
			userDto.login
		)
		if (candidateByLogin) {
			throw new HttpException('Логин уже занят', HttpStatus.BAD_REQUEST)
		}

		const candidateByEmail = await this.usersService.getUserByEmail(
			userDto.email
		)
		if (candidateByEmail) {
			throw new HttpException('Email уже занят', HttpStatus.BAD_REQUEST)
		}

		const hashPassword = await bcrypt.hash(userDto.password, 10)

		const result = await this.usersService.createUser({
			...userDto,
			password: hashPassword,
		})

		const { accessToken, refreshToken } = this.tokensService.generateTokens({
			_id: String(result.user._id),
			login: result.user.login,
			email: result.user.email,
			role: result.user.role,
		})

		this.tokensService.setRefreshTokenCookie(
			res,
			TokenType.REFRESH,
			refreshToken
		)
		this.tokensService.setRefreshTokenCookie(res, TokenType.ACCESS, accessToken)

		return {
			status: 'success',
			message: 'Пользователь успешно зарегистрирован',
			accessToken,
		}
	}

	async logout(res: Response) {
		this.tokensService.removeTokens(res)

		return {
			status: 'success',
			message: 'Вы вышли из аккаунта',
		}
	}

	async refreshToken(req: Request, res: Response) {
		const refreshTokenCookie = req.cookies?.refresh_token
		if (!refreshTokenCookie) {
			throw new HttpException('Токен не найден', HttpStatus.UNAUTHORIZED)
		}

		const payload = this.tokensService.validateRefreshToken(refreshTokenCookie)
		const user = await this.usersService.getUserByEmail(payload.email)

		if (!user) {
			throw new HttpException('Пользователь не найден', HttpStatus.UNAUTHORIZED)
		}

		const { accessToken, refreshToken } = this.tokensService.generateTokens({
			_id: user?._id?.toString(),
			login: user.login,
			email: user.email,
			role: user.role,
		})

		this.tokensService.setRefreshTokenCookie(
			res,
			TokenType.REFRESH,
			refreshToken
		)
		this.tokensService.setRefreshTokenCookie(res, TokenType.ACCESS, accessToken)

		return {
			status: 'success',
			message: 'Токен обновлён',
			accessToken,
		}
	}

	async getProfile(userId: string) {
		const user = await this.usersService.getUserById(userId)

		if (!user) {
			throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			data: user,
		}
	}

	private async validateUser(userDto: LoginUserDto) {
		const user = await this.usersService.getUserByLoginOrEmail(
			userDto.loginOrEmail
		)

		if (!user) {
			throw new HttpException(
				'Неверный логин или email',
				HttpStatus.BAD_REQUEST
			)
		}

		const passwordEquals = await bcrypt.compare(
			userDto.password,
			user.password
		)

		if (!passwordEquals) {
			throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST)
		}

		return user
	}
}
