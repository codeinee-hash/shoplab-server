import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto'
import { Category, CategoryDocument } from './schemas/category.schema'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
	) {}

	async create(dto: CreateCategoryDto) {
		const existing = await this.categoryModel.findOne({ name: dto.name })
		if (existing) {
			throw new HttpException('Категория с таким названием уже существует', HttpStatus.BAD_REQUEST)
		}

		const category = await this.categoryModel.create(dto)

		return {
			status: 'success',
			message: 'Категория создана',
			data: category,
		}
	}

	async findAll() {
		const categories = await this.categoryModel.find().exec()

		return {
			status: 'success',
			data: categories,
		}
	}

	async findById(id: string) {
		const category = await this.categoryModel.findById(id)
		if (!category) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			data: category,
		}
	}

	async update(id: string, dto: UpdateCategoryDto) {
		const category = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true })
		if (!category) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Категория обновлена',
			data: category,
		}
	}

	async delete(id: string) {
		const category = await this.categoryModel.findByIdAndDelete(id)
		if (!category) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Категория удалена',
		}
	}
}
