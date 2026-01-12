import { Prisma } from '@prisma/client'
import { prisma } from './db.js'

export const resolvers = {
	Query: {
		hello: async () => {
			return 'Hello from GraphQL'
		},

		health: async () => {
			return {
				status: 'ok',
				timestamp: new Date().toISOString(),
			}
		},

		tables: async () => {
			return await prisma.table.findMany()
		},

		availableTables: async (
			_parent: any,
			args: { date: string; guestCount: number }
		) => {
			const { date, guestCount } = args

			const tables = await prisma.table.findMany({
				where: {
					capacity: { gte: guestCount },
					status: 'AVAILABLE',
				},
				include: {
					reservations: {
						where: {
							// FIXME: нужно ко дню добавить ещё временной диапазон
							//  gte: new Date(date + 'T00:00:00.000Z'), // >= начала дня
							//  lt: new Date(date + 'T23:59:59.999Z')   // < конца дня
							reservationDate: new Date(date),
							status: { not: 'CANCELLED' },
						},
					},
				},
			})

			return tables.filter(table => table.reservations.length === 0)
		},

		// TODO: временный resolver для меня. Обрати внимание на
		reservations: async () => {
			return await prisma.reservation.findMany({
				include: {
					table: true,
				},
			})
		},
	},

	Mutation: {
		createReservation: async (
			_parent: any,
			// FIXME:Нужно добавить для input тип. Вопрос откуда (schema.graphql / schema.prisma)
			args: { input: any }
		) => {
			const {
				tableId,
				customerName,
				customerPhone,
				reservationDate,
				guestCount,
			} = args.input

			try {
				const reservation = await prisma.reservation.create({
					data: {
						tableId: parseInt(tableId),
						customerName,
						customerPhone,
						reservationDate: new Date(reservationDate),
						guestCount,
					},
					include: { table: true },
				})

				return reservation
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === 'P2002')
						throw new Error(
							'This table is already reserved for the selected date/time'
						)
				}
				throw error
			}
		},

		cancelReservation: async (_parent: any, args: { id: string }) => {
			return await prisma.reservation.update({
				where: { id: parseInt(args.id) },
				data: { status: 'CANCELLED' },
				include: { table: true },
			})
		},
	},
}
