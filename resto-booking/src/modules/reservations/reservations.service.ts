import { prisma } from '../../config/db.js'
import type { CreateReservationInput } from '../../generated/graphql.js'
import { NotFoundError, ValidationError } from '../../shared/errors.js'

export class ReservationsService {
	async getReservation(id: string) {
		const reservation = await prisma.reservation.findUnique({
			where: { id: parseInt(id) },
			include: {
				table: true,
				guests: true,
			},
		})

		if (!reservation) {
			throw new NotFoundError(`Reservations ${id} not found`)
		}

		return reservation
	}

	async getAllReservations() {
		return await prisma.reservation.findMany({
			include: {
				table: true,
				guests: true,
			},
			orderBy: { reservationDate: 'desc' },
		})
	}

	async createReservation(input: CreateReservationInput) {
		const {
			tableId,
			customerName,
			customerPhone,
			reservationDate,
			guestCount,
		} = input

		const bookingDate = new Date(reservationDate)

		if (bookingDate < new Date()) {
			throw new ValidationError('Cannot create reservation in the past')
		}

		if (guestCount < 1) {
			throw new ValidationError('Guest count must be at least 1')
		}

		const table = await prisma.table.findUnique({
			where: { id: parseInt(tableId) },
		})

		if (!table) {
			throw new NotFoundError(`Table ${tableId} not found`)
		}

		if (table.status !== 'AVAILABLE') {
			throw new ValidationError(
				`This table - ${table.tableNumber} is not available for booking`,
			)
		}

		if (table.capacity < guestCount) {
			throw new ValidationError(
				`Table capacity is ${table.capacity}, but guest request table on ${guestCount} person`,
			)
		}

		const existingReservation = await prisma.reservation.findFirst({
			where: {
				tableId: parseInt(tableId),
				reservationDate: bookingDate,
				status: { not: 'CANCELLED' },
			},
		})

		if (existingReservation) {
			throw new ValidationError(
				`Table ${table.tableNumber} is already reserved for this time`,
			)
		}

		try {
			const data = {
				tableId: parseInt(tableId),
				customerName,
				customerPhone,
				reservationDate: new Date(reservationDate),
				guestCount,
			}

			return await prisma.reservation.create({
				data,
				include: {
					table: true,
					guests: true,
				},
			})
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ValidationError(
					'Reservation already exists for this table and time',
				)
			}
			throw error
		}
	}

	async cancelReservation(id: string) {
		const existing = await prisma.reservation.findUnique({
			where: { id: parseInt(id) },
		})

		if (!existing) {
			throw new NotFoundError(`Reservation ${id} not found`)
		}

		if (existing.status === 'CANCELLED') {
			throw new ValidationError('Reservation is already cancelled')
		}

		return await prisma.reservation.update({
			where: { id: parseInt(id) },
			data: { status: 'CANCELLED' },
			include: { table: true },
		})
	}
}
