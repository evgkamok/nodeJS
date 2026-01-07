import { prisma } from '../src/db.js'

async function main() {
	console.log('🌱 Seeding database...')

	await prisma.table.createMany({
		data: [
			{ tableNumber: 'T1', capacity: 2, status: 'AVAILABLE' },
			{ tableNumber: 'T2', capacity: 4, status: 'AVAILABLE' },
			{ tableNumber: 'T3', capacity: 8, status: 'OCCUPIED' },
			{ tableNumber: 'T4', capacity: 4, status: 'AVAILABLE' },
		],
	})

	console.log('✅ Seed completed!')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
