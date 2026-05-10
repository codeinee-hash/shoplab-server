import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'
import { Favorites, FavoritesSchema } from './schemas/favorites.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Favorites.name, schema: FavoritesSchema }]),
		AuthModule,
	],
	controllers: [FavoritesController],
	providers: [FavoritesService],
	exports: [FavoritesService],
})
export class FavoritesModule {}
