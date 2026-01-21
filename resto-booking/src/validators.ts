import { error } from 'node:console'
import z from 'zod'

export const CreateReservationSchema = z.object({
	tableId: z.string().min(1, 'Table ID is required'),

	customerName: z
		.string()
		.min(2, 'Customer name must be at least 2 characters')
		.max(100, 'Customer name is too long'),

	customerPhone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),

	reservationDate: z.iso.date('Invalid date format'),

	guestCount: z
		.number()
		.int('Guest count must be integer')
		.min(1, 'Guest count must be at least 1')
		.max(20, 'Guest count cannot exceed 20'),
})

export const AvailableTableSchema = z.object({
	// date: z.iso.date('Invalid date format'),
	date: z
		.string()
		.min(1, 'Date is required')
		.refine(val => !isNaN(Date.parse(val)), {
			message: 'Invalid date format',
		})
		.transform(val => new Date(val)),
	guestCount: z
		.number()
		.int('Guest count must be an integer')
		.min(1, 'Guest count must be at least 1')
		.max(20, 'Guest count cannot exceed 20'),
})
