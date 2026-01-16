import { Prisma } from '@prisma/client'
import { prisma } from './db.js'
import {
	CreateReservationSchema,
	AvailableTableSchema,
} from './validators.js'
import { ValidationError } from './errors.js'
import { validate } from './utils.js'

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
			// Валидация через helper (одна строка!)
			const { date, guestCount } = validate(AvailableTableSchema, args)

			const requestedDate = new Date(date)

			// Проверка что дата не в прошлом
			if (requestedDate < new Date()) {
				throw new ValidationError('Cannot book tables in the past')
			}

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

		// TODO: написать резолвер для одной резервации
		reservation: async (_parent: any, args: { id: string }) => {
			const reservation = await prisma.reservation.findUnique({
				where: { id: parseInt(args.id) },
				include: { table: true },
			})

			if (!reservation) {
				throw new ValidationError(
					`Reservation with ID ${args.id} not found`
				)
			}

			return reservation
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
			} = validate(CreateReservationSchema, args.input)

			const bookingDate = new Date(reservationDate)

			if (bookingDate < new Date()) {
				throw new ValidationError('Cannot create reservation in the past')
			}

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

	Table: {
		// FIXME нужно для parent использовать сгенерированные prisma типы
		// Нужно по переписывать этот участок кода
		// Загружаем бронирования ДЛЯ этого стола
		reservations: async (parent: any) => {
			return await prisma.reservation.findMany({
				where: { tableId: parent.id },
			})
		},
	},

	// Загружаем стол ДЛЯ этого бронирования
	Reservation: {
		table: async (parent: any) => {
			return await prisma.table.findUnique({
				where: { id: parent.tableId },
			})
		},
	},
}
