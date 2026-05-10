import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { Order, OrderSchema } from './schemas/order.schema'
import { Product, ProductSchema } from 'src/products/schemas/product.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Order.name, schema: OrderSchema },
			{ name: Product.name, schema: ProductSchema },
		]),
		AuthModule,
	],
	controllers: [OrdersController],
	providers: [OrdersService],
	exports: [OrdersService],
})
export class OrdersModule { }
