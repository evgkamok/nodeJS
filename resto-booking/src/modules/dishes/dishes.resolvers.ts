import { DishesService } from './dishes.service.js'

const service = new DishesService()

export const dishesResolvers = {
	Query: {
		menu: async () => {
			return await service.getAllDishes()
		},

		dish: async (_parent: any, args: { id: string }) => {
			return await service.getDish(args.id)
		},

		dishesByCategory: async (_parent: any, args: { category: string }) => {
			return await service.getDishesByCategory(args.category)
		},
	},
}
