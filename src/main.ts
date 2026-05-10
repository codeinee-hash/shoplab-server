import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'

async function run() {
	const PORT = process.env.PORT || 8080
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: true,
		credentials: true,
	})

	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	const config = new DocumentBuilder()
		.setTitle('ShopLab API')
		.setDescription(
			'REST API для учебного интернет-магазина. ' +
			'Включает авторизацию, товары, категории, корзину, избранное и заказы. ' +
			'Админ-эндпоинты доступны только для пользователей с ролью ADMIN.'
		)
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/api/swagger-ui', app, document)

	await app.listen(PORT, () => console.log(`🚀 Server started on port - ${PORT}`))
}

run()
