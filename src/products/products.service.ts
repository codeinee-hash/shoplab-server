import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto/product.dto'
import { Product, ProductDocument } from './schemas/product.schema'

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>
	) {}

	async create(dto: CreateProductDto) {
		const product = await this.productModel.create(dto)

		return {
			status: 'success',
			message: 'Товар создан',
			data: product,
		}
	}

	async findAll(query: ProductQueryDto) {
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

		return {
			status: 'success',
			data: products,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		}
	}

	async findById(id: string) {
		const product = await this.productModel.findById(id).populate('category', 'name')
		if (!product) {
			throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			data: product,
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
