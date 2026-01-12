import { prisma } from '../src/db.js'

async function main() {
	console.log('🌱 Seeding database...')

	// Очищаем старые данные
	// await prisma.reservation.deleteMany()
	// await prisma.table.deleteMany()

	// Создаём столы
	// const tables = await prisma.table.createMany({
	// 	data: [
	// 		{ tableNumber: 'T1', capacity: 2, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T2', capacity: 4, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T3', capacity: 6, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T4', capacity: 4, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T5', capacity: 8, status: 'AVAILABLE' },
	// 	],
	// })

	// Создаём тестовое бронирование
	await prisma.reservation.create({
		data: {
			tableId: 34,
			customerName: 'Иван Test',
			customerPhone: '+7 999 123-45-67',
			reservationDate: new Date('2026-01-10T18:00:00Z'),
			guestCount: 2,
			status: 'CONFIRMED',
		},
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
