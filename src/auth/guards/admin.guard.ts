import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest()

		try {
			const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

			if (!token) {
				throw new UnauthorizedException({
					message: 'Пользователь не авторизован',
				})
			}

			const user = req.user

			if (!user || user.role !== 'ADMIN') {
				throw new ForbiddenException('Доступ запрещён. Только для администраторов')
			}

			return true
		} catch (error) {
			throw new ForbiddenException('Доступ запрещён. Только для администраторов')
		}
	}
}
