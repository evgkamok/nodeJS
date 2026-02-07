import { TablesService } from './tables.service.js'

const service = new TablesService()

export const tablesResolvers = {
	Query: {
		tables: async () => {
			return await service.getAllTables()
		},

		availableTables: async (
			_parent: any,
			args: { date: string; guestCount: number },
		) => {
			const { date, guestCount } = args
			return await service.findAvailableTables(new Date(date), guestCount)
		},
	},
}
