import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { FavoritesService } from 'src/favorites/favorites.service'
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto/product.dto'
import { Product, ProductDocument } from './schemas/product.schema'

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
		private favoritesService: FavoritesService
	) {}

	async create(dto: CreateProductDto) {
		const product = await this.productModel.create(dto)

		return {
			status: 'success',
			message: 'Товар создан',
			data: product,
		}
	}

	async findAll(query: ProductQueryDto, userId?: string) {
		const filter: FilterQuery<ProductDocument> = {}

		// Поиск по названию
		if (query.search) {
			filter.name = { $regex: query.search, $options: 'i' }
		}

		// Фильтр по категории
		if (query.category) {
			filter.category = query.category
		}

		// Фильтр по цене
		if (query.minPrice !== undefined || query.maxPrice !== undefined) {
			filter.price = {}
			if (query.minPrice !== undefined) {
				filter.price.$gte = query.minPrice
			}
			if (query.maxPrice !== undefined) {
				filter.price.$lte = query.maxPrice
			}
		}

		// Сортировка
		const sortField = query.sortBy || 'createdAt'
		const sortOrder = query.order === 'asc' ? 1 : -1
		const sort: Record<string, 1 | -1> = { [sortField]: sortOrder }

		// Пагинация
		const page = query.page && query.page > 0 ? query.page : 1
		const limit = query.limit && query.limit > 0 ? query.limit : 10
		const skip = (page - 1) * limit

		const [products, total] = await Promise.all([
			this.productModel
				.find(filter)
				.populate('category', 'name')
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.exec(),
			this.productModel.countDocuments(filter),
		])

		// Получаем список избранных товаров пользователя (если авторизован)
		const favoriteIds = userId
			? await this.favoritesService.getUserFavoriteIds(userId)
			: []

		const productsWithFavorite = products.map((product) => {
			const productObj = product.toObject()
			return {
				...productObj,
				isFavorite: favoriteIds.includes(String(productObj._id)),
			}
		})

		return {
			status: 'success',
			data: productsWithFavorite,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		}
	}

	async findById(id: string, userId?: string) {
		const product = await this.productModel.findById(id).populate('category', 'name')
		if (!product) {
			throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)
		}

		const favoriteIds = userId
			? await this.favoritesService.getUserFavoriteIds(userId)
			: []

		return {
			status: 'success',
			data: {
				...product.toObject(),
				isFavorite: favoriteIds.includes(String(product._id)),
			},
		}
	}

	async update(id: string, dto: UpdateProductDto) {
		const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).populate('category', 'name')
		if (!product) {
			throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Товар обновлён',
			data: product,
		}
	}

	async delete(id: string) {
		const product = await this.productModel.findByIdAndDelete(id)
		if (!product) {
			throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Товар удалён',
		}
	}
}
