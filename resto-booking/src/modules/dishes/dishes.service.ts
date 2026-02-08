import { prisma } from '../../config/db.js'
import { NotFoundError } from '../../shared/errors.js'

export class DishesService {
	async getAllDishes(category?: string) {
		return await prisma.dish.findMany({
			where: { available: true },
			orderBy: [{ category: 'asc' }, { name: 'asc' }],
		})
	}

	async getDishesByCategory(category: string) {
		return await prisma.dish.findMany({
			where: { category, available: true },
			orderBy: [{ name: 'asc' }],
		})
	}

	async getDish(id: string) {
		const dish = await prisma.dish.findUnique({
			where: { id: parseInt(id) },
		})

		if (!dish) {
			throw new NotFoundError(`Dish ${id} not found`)
		}

		return dish
	}
}
