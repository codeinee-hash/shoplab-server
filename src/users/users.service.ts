import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/user.dto'
import { User, UserDocument, UserRole } from './schemas/user.schema'

@Injectable()
export class UsersService implements OnModuleInit {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {}

	async onModuleInit() {
		await this.seedAdmin()
	}

	private async seedAdmin() {
		const adminLogin = process.env.ADMIN_LOGIN || 'admin'
		const adminEmail = process.env.ADMIN_EMAIL || 'admin@shoplab.com'
		const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

		const existingAdmin = await this.userModel.findOne({
			$or: [{ login: adminLogin }, { email: adminEmail }],
		})

		if (!existingAdmin) {
			const hashPassword = await bcrypt.hash(adminPassword, 10)
			await this.userModel.create({
				login: adminLogin,
				email: adminEmail,
				password: hashPassword,
				role: UserRole.ADMIN,
			})
			console.log(`✅ Admin пользователь создан: ${adminLogin} / ${adminEmail}`)
		}
	}

	async createUser(dto: CreateUserDto & { role?: string }) {
		const createdUser = new this.userModel(dto)
		const user = await createdUser.save()

		return {
			status: 'success',
			user,
		}
	}

	async getAllUsers() {
		const users = await this.userModel.find().select('-password').exec()

		return {
			status: 'success',
			data: users,
		}
	}

	async getUserByEmail(email: string) {
		const user = await this.userModel.findOne({ email }).lean()
		return user
	}

	async getUserByLogin(login: string) {
		const user = await this.userModel.findOne({ login }).lean()
		return user
	}

	async getUserByLoginOrEmail(loginOrEmail: string) {
		const user = await this.userModel
			.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
			.lean()
		return user
	}

	async getUserById(id: string) {
		const user = await this.userModel.findById(id).select('-password').lean()
		return user
	}
}
