import { prisma } from '../../config/db.js'
import type { CreateOrderInput } from '../../generated/graphql.js'
import { NotFoundError, ValidationError } from '../../shared/errors.js'

export class OrdersService {
	async getOrdersByGuest(guestId: number) {
		const orders = await prisma.order.findMany({
			where: { guestId: guestId },
			include: { dish: true },
			orderBy: { createdAt: 'desc' },
		})

		if (!orders) {
			throw new NotFoundError(`Orders for this guest ${guestId} not found`)
		}

		return orders
	}

	async createOrder(input: CreateOrderInput) {
		const { guestId, dishId, quantity } = input

		const guest = await prisma.guest.findUnique({
			where: { id: parseInt(guestId) },
		})

		if (!guest) {
			throw new NotFoundError(`Guest ${guestId} not found`)
		}

		const dish = await prisma.dish.findUnique({
			where: { id: parseInt(dishId) },
		})

		if (!dish) {
			throw new NotFoundError(`Dish ${dishId} not found`)
		}

		if (!dish.available) {
			throw new ValidationError(`Dish "${dish.name}" is not available`)
		}

		return await prisma.order.create({
			data: {
				dishId: parseInt(dishId),
				guestId: parseInt(guestId),
				quantity,
			},
			include: {
				dish: true,
				guest: true,
			},
		})
	}
}
