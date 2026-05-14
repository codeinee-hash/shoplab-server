import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest()

		try {
			const token =
				req.cookies?.access_token ||
				req.headers.authorization?.split(' ')[1]

			if (token) {
				const user = this.jwtService.verify(token)
				req.user = user
			}
		} catch (error) {
			// Токен невалидный или протух — ничего не делаем.
			// Запрос пройдёт как гостевой (req.user останется undefined).
		}

		return true
	}
}
