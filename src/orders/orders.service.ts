import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { CreateOrderDto, OrderQueryDto, UpdateOrderStatusDto } from './dto/order.dto'
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema'
import { Product, ProductDocument } from 'src/products/schemas/product.schema'

@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
		@InjectModel(Product.name) private productModel: Model<ProductDocument>
	) {}

	async create(userId: string, dto: CreateOrderDto) {
		const totalPrice = dto.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)

		const items = dto.items.map((item) => ({
			product: item.productId,
			quantity: item.quantity,
			price: item.price,
		}))

		const order = await this.orderModel.create({
			user: userId,
			items,
			totalPrice,
			deliveryAddress: dto.deliveryAddress,
			comment: dto.comment || '',
		})

		// Уменьшаем количество товара на складе
		for (const item of dto.items) {
			await this.productModel.findByIdAndUpdate(item.productId, {
				$inc: { stock: -item.quantity },
			})
		}

		return {
			status: 'success',
			message: 'Заказ создан',
			data: order,
		}
	}

	async findUserOrders(userId: string) {
		const orders = await this.orderModel
			.find({ user: userId })
			.populate('items.product', 'name price image')
			.sort({ createdAt: -1 })
			.exec()

		return {
			status: 'success',
			data: orders,
		}
	}

	async findById(id: string, userId?: string) {
		const filter: FilterQuery<OrderDocument> = { _id: id }
		if (userId) {
			filter.user = userId
		}

		const order = await this.orderModel
			.findOne(filter)
			.populate('user', 'login email')
			.populate('items.product', 'name price image')

		if (!order) {
			throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			data: order,
		}
	}

	async cancelOrder(id: string, userId: string) {
		const order = await this.orderModel.findOne({ _id: id, user: userId })

		if (!order) {
			throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
		}

		if (order.status === OrderStatus.CANCELLED) {
			throw new HttpException('Заказ уже отменён', HttpStatus.BAD_REQUEST)
		}

		if (order.status === OrderStatus.DELIVERED) {
			throw new HttpException('Нельзя отменить доставленный заказ', HttpStatus.BAD_REQUEST)
		}

		order.status = OrderStatus.CANCELLED
		await order.save()

		// Возвращаем товар на склад при отмене заказа
		for (const item of order.items) {
			await this.productModel.findByIdAndUpdate(item.product, {
				$inc: { stock: item.quantity },
			})
		}

		return {
			status: 'success',
			message: 'Заказ отменён',
			data: order,
		}
	}

	// Admin methods

	async findAllOrders(query: OrderQueryDto) {
		const filter: FilterQuery<OrderDocument> = {}

		if (query.status) {
			filter.status = query.status
		}

		const page = query.page && query.page > 0 ? query.page : 1
		const limit = query.limit && query.limit > 0 ? query.limit : 10
		const skip = (page - 1) * limit

		const [orders, total] = await Promise.all([
			this.orderModel
				.find(filter)
				.populate('user', 'login email')
				.populate('items.product', 'name price image')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.exec(),
			this.orderModel.countDocuments(filter),
		])

		return {
			status: 'success',
			data: orders,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		}
	}

	async updateStatus(id: string, dto: UpdateOrderStatusDto) {
		const order = await this.orderModel.findByIdAndUpdate(
			id,
			{ status: dto.status },
			{ new: true }
		)
			.populate('user', 'login email')
			.populate('items.product', 'name price image')

		if (!order) {
			throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: `Статус заказа обновлён на "${dto.status}"`,
			data: order,
		}
	}
}
