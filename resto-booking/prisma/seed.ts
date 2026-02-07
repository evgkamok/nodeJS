import { prisma } from '../src/config/db.js'

async function main() {
	console.log('🌱 Seeding database...')

	// Очищаем старые данные
	// await prisma.reservation.deleteMany()
	// await prisma.table.deleteMany()

	// Создаём столы
	// console.log('Creating tables...');
	// const tables = await prisma.table.createMany({
	// 	data: [
	// 		{ tableNumber: 'T1', capacity: 2, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T2', capacity: 4, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T3', capacity: 6, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T4', capacity: 4, status: 'AVAILABLE' },
	// 		{ tableNumber: 'T5', capacity: 8, status: 'AVAILABLE' },
	// 	],
	// })

	// Создаём тестовое бронирование ПЕРВАЯ ВЕРСИЯ
	// await prisma.reservation.create({
	// 	data: {
	// 		tableId: 34,
	// 		customerName: 'Иван Test',
	// 		customerPhone: '+7 999 123-45-67',
	// 		reservationDate: new Date('2026-01-10T18:00:00Z'),
	// 		guestCount: 2,
	// 		status: 'CONFIRMED',
	// 	},
	// })

	// Создаем меню
	console.log('Create menu...')
	await prisma.dish.createMany({
		data: [
			{
				name: 'Цезарь с курицей',
				description: 'Классический салат',
				price: 450,
				category: 'Салаты',
				available: true,
			},
			{
				name: 'Греческий салат',
				description: 'С фетой и оливками',
				price: 380,
				category: 'Салаты',
				available: true,
			},

			// Основные блюда
			{
				name: 'Стейк рибай',
				description: '300г, средней прожарки',
				price: 1200,
				category: 'Мясо',
				available: true,
			},
			{
				name: 'Паста карбонара',
				description: 'С беконом и пармезаном',
				price: 550,
				category: 'Паста',
				available: true,
			},
			{
				name: 'Лосось на гриле',
				description: 'С овощами',
				price: 890,
				category: 'Рыба',
				available: true,
			},

			// Напитки
			{
				name: 'Кока-кола',
				description: '0.33л',
				price: 150,
				category: 'Напитки',
				available: true,
			},
			{
				name: 'Апельсиновый сок',
				description: 'Свежевыжатый, 0.25л',
				price: 200,
				category: 'Напитки',
				available: true,
			},
		],
	})

	// Создаём тестовое бронирование с гостями и заказами
	console.log('Create test reservation...')
	const reservation = await prisma.reservation.create({
		data: {
			tableId: 1,
			customerName: 'Иван Петров',
			customerPhone: '+7 999 123-45-67',
			reservationDate: new Date('2026-01-28T18:00:00Z'),
			guestCount: 2,
			status: 'CONFIRMED',
			guests: {
				create: [
					{
						guestNumber: 1,
						orders: {
							create: [
								{ dishId: 1, quantity: 1 }, // cesar
								{ dishId: 3, quantity: 3 }, // steak
							],
						},
					},
					{
						guestNumber: 2,
						orders: {
							create: [
								{ dishId: 4, quantity: 1 }, // Паста
								{ dishId: 6, quantity: 2 }, // Кока-кола x2
							],
						},
					},
				],
			},
		},
	})

	console.log('✅ Seed completed!')
	console.log(
		`Created reservation #${reservation.id} with guests and orders`,
	)
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
