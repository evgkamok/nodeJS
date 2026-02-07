import { prisma } from '../../config/db.js'
import { ValidationError } from '../../shared/errors.js'

export class TablesService {
	async getAllTables() {
		return await prisma.table.findMany({
			orderBy: { tableNumber: 'asc' },
		})
	}

	async findAvailableTables(date: Date, guestCount: number) {
		if (guestCount < 1) {
			throw new ValidationError('Guest count must be at least 1 person')
		}

		if (date < new Date()) {
			throw new ValidationError('Cannot book tables in the past')
		}

		return await prisma.table.findMany({
			where: {
				status: 'AVAILABLE',
				capacity: { gte: guestCount },
				reservations: {
					none: {
						reservationDate: date,
						status: { in: ['CONFIRMED', 'PENDING'] },
					},
				},
			},
			orderBy: [{ capacity: 'asc' }, { tableNumber: 'asc' }],
		})
	}
}
