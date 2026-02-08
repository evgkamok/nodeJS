import { Prisma } from '@prisma/client'
import { prisma } from './config/db.js'
import {
	CreateReservationSchema,
	AvailableTableSchema,
	CreateOrderSchema,
} from './shared/validators.js'
import { ValidationError } from './shared/errors.js'
// import { validate } from './utils.js'
import { TablesRepositoryRaw } from './repositories/tables-raw.js'
import { tablesResolvers } from './modules/tables/tables.resolvers.js'
import { reservationsResolvers } from './modules/reservations/reservations.resolvers.js'
import { dishesResolvers } from './modules/dishes/dishes.resolvers.js'
import { ordersResolvers } from './modules/orders/orders.resolvers.js'

// export const resolvers = {

// 		Tables
// 		availableTablesRaw: async (
// 			_parent: any,
// 			args: { date: string; guestCount: number },
// 			context: any,
// 		) => {
// 			const { date, guestCount } = validate(AvailableTableSchema, args)

// 			const requestedDate = new Date(date)
// 			if (requestedDate < new Date()) {
// 				throw new ValidationError('Cannot book tables in the past')
// 			}

// 			// Используем raw SQL репозиторий
// 			const repo = new TablesRepositoryRaw(context.pg)
// 			return await repo.findAvailable(requestedDate, guestCount)
// 		},

// 		// Guest
// 		guest: async (_parent: any, args: { id: string }) => {
// 			return await prisma.guest.findUnique({
// 				where: { id: parseInt(args.id) },
// 			})
// 		},

// 	Table: {
// 		// FIXME нужно для parent использовать сгенерированные prisma типы ?
// 		// Нужно по переписывать этот участок кода

// 		// Загружаем бронирования ДЛЯ этого стола
// 		reservations: async (parent: any) => {
// 			return await prisma.reservation.findMany({
// 				where: { tableId: parent.id },
// 			})
// 		},
// 	},

// 	// Загружаем стол ДЛЯ этого бронирования
// 	Reservation: {
// 		table: async (parent: any) => {
// 			return await prisma.table.findUnique({
// 				where: { id: parent.tableId },
// 			})
// 		},
// 		totalAmount: async () => {
// 			// DO LATER
// 		},
// 	},

// 	Guest: {
// 		orders: async (parent: any) => {
// 			return await prisma.order.findMany({
// 				where: { guestId: parent.id },
// 				include: { dish: true },
// 			})
// 		},

// 		subtotal: async (parent: any) => {
// 			const orders = await prisma.order.findMany({
// 				where: { guestId: parent.id },
// 				include: { dish: true },
// 			})

// 			const subtotal = orders.reduce((sum, order) => {
// 				return sum + order.quantity * order.dish.price.toNumber()
// 			}, 0)

// 			return subtotal
// 		},
// 	},

// 	Order: {
// 		dish: async (parent: any) => {
// 			return await prisma.dish.findUnique({
// 				where: { id: parent.dishId },
// 			})
// 		},

// 		subtotal: async (parent: any) => {
// 			const dish = await prisma.dish.findUnique({
// 				where: { id: parent.dishId },
// 			})

// 			return dish ? dish.price.toNumber() * parent.quantity : 0
// 		},
// 	},
// }

export const resolvers = {
	Query: {
		...tablesResolvers.Query,
		...reservationsResolvers.Query,
		...dishesResolvers.Query,
		...ordersResolvers.Query,
	},
	Mutation: {
		...reservationsResolvers.Mutation,
		...ordersResolvers.Mutation,
	},
}
