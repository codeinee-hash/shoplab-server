import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokensService } from './token.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, TokensService],
	imports: [
		forwardRef(() => UsersModule),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'SECRET',
			signOptions: { expiresIn: '7d' },
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
