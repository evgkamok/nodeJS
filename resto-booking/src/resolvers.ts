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
		tables: async () => prisma.table.findMany(),
	},
}
