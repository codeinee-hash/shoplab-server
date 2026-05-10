import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto'
import { Cart, CartDocument } from './schemas/cart.schema'

@Injectable()
export class CartService {
	constructor(
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>
	) {}

	async getCart(userId: string) {
		let cart = await this.cartModel
			.findOne({ user: userId })
			.populate('items.product', 'name price image stock')
			.exec()

		if (!cart) {
			cart = await this.cartModel.create({ user: userId, items: [] })
		}

		return {
			status: 'success',
			data: cart,
		}
	}

	async addItem(userId: string, dto: AddToCartDto) {
		let cart = await this.cartModel.findOne({ user: userId })

		if (!cart) {
			cart = await this.cartModel.create({
				user: userId,
				items: [{ product: dto.productId, quantity: dto.quantity }],
			})
		} else {
			const existingItem = cart.items.find(
				(item) => item.product.toString() === dto.productId
			)

			if (existingItem) {
				existingItem.quantity += dto.quantity
			} else {
				cart.items.push({ product: dto.productId as any, quantity: dto.quantity })
			}

			await cart.save()
		}

		const populated = await this.cartModel
			.findById(cart._id)
			.populate('items.product', 'name price image stock')

		return {
			status: 'success',
			message: 'Товар добавлен в корзину',
			data: populated,
		}
	}

	async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
		const cart = await this.cartModel.findOne({ user: userId })

		if (!cart) {
			throw new HttpException('Корзина не найдена', HttpStatus.NOT_FOUND)
		}

		const item = cart.items.find(
			(item) => item.product.toString() === productId
		)

		if (!item) {
			throw new HttpException('Товар не найден в корзине', HttpStatus.NOT_FOUND)
		}

		item.quantity = dto.quantity
		await cart.save()

		const populated = await this.cartModel
			.findById(cart._id)
			.populate('items.product', 'name price image stock')

		return {
			status: 'success',
			message: 'Количество обновлено',
			data: populated,
		}
	}

	async removeItem(userId: string, productId: string) {
		const cart = await this.cartModel.findOne({ user: userId })

		if (!cart) {
			throw new HttpException('Корзина не найдена', HttpStatus.NOT_FOUND)
		}

		cart.items = cart.items.filter(
			(item) => item.product.toString() !== productId
		)
		await cart.save()

		const populated = await this.cartModel
			.findById(cart._id)
			.populate('items.product', 'name price image stock')

		return {
			status: 'success',
			message: 'Товар удалён из корзины',
			data: populated,
		}
	}

	async clearCart(userId: string) {
		const cart = await this.cartModel.findOne({ user: userId })

		if (cart) {
			cart.items = []
			await cart.save()
		}

		return {
			status: 'success',
			message: 'Корзина очищена',
		}
	}
}
