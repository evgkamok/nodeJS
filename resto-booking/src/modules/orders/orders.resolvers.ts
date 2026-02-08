import type { CreateOrderInput } from '../../generated/graphql.js'
import { validate } from '../../shared/utils.js'
import { CreateOrderSchema } from '../../shared/validators.js'
import { OrdersService } from './orders.service.js'

const service = new OrdersService()

export const ordersResolvers = {
	Query: {
		guestOrders: async (_parent: any, args: { guestId: number }) => {
			return await service.getOrdersByGuest(args.guestId)
		},
	},
	Mutation: {
		createOrder: async (
			_parent: any,
			args: { input: CreateOrderInput },
		) => {
			const input = validate(CreateOrderSchema, args.input)
			return await service.createOrder(input)
		},
	},
}
