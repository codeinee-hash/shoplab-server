import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AddFavoriteDto } from './dto/favorites.dto'
import { Favorites, FavoritesDocument } from './schemas/favorites.schema'

@Injectable()
export class FavoritesService {
	constructor(
		@InjectModel(Favorites.name) private favoritesModel: Model<FavoritesDocument>
	) {}

	async getFavorites(userId: string) {
		let favorites = await this.favoritesModel
			.findOne({ user: userId })
			.populate('products', 'name price image stock category')
			.exec()

		if (!favorites) {
			favorites = await this.favoritesModel.create({ user: userId, products: [] })
		}

		return {
			status: 'success',
			data: favorites,
		}
	}

	async addToFavorites(userId: string, dto: AddFavoriteDto) {
		let favorites = await this.favoritesModel.findOne({ user: userId })

		if (!favorites) {
			favorites = await this.favoritesModel.create({
				user: userId,
				products: [dto.productId],
			})
		} else {
			const alreadyExists = favorites.products.some(
				(p) => p.toString() === dto.productId
			)

			if (alreadyExists) {
				return {
					status: 'success',
					message: 'Товар уже в избранном',
				}
			}

			favorites.products.push(dto.productId as any)
			await favorites.save()
		}

		const populated = await this.favoritesModel
			.findById(favorites._id)
			.populate('products', 'name price image stock category')

		return {
			status: 'success',
			message: 'Товар добавлен в избранное',
			data: populated,
		}
	}

	async removeFromFavorites(userId: string, productId: string) {
		const favorites = await this.favoritesModel.findOne({ user: userId })

		if (favorites) {
			favorites.products = favorites.products.filter(
				(p) => p.toString() !== productId
			)
			await favorites.save()
		}

		const populated = await this.favoritesModel
			.findOne({ user: userId })
			.populate('products', 'name price image stock category')

		return {
			status: 'success',
			message: 'Товар удалён из избранного',
			data: populated,
		}
	}
}
