import type { CreateReservationInput } from '../../generated/graphql.js'
import { validate } from '../../shared/utils.js'
import { CreateReservationSchema } from '../../shared/validators.js'
import { ReservationsService } from './reservations.service.js'

const service = new ReservationsService()

export const reservationsResolvers = {
	Query: {
		reservation: async (_parent: any, args: { id: string }) => {
			return await service.getReservation(args.id)
		},

		reservations: async () => {
			return await service.getAllReservations()
		},
	},

	Mutation: {
		createReservation: async (
			_parent: any,
			args: { input: CreateReservationInput },
		) => {
			const input = validate(CreateReservationSchema, args.input)
			return await service.createReservation(input)
		},

		cancelReservation: async (_parent: any, args: { id: string }) => {
			return await service.cancelReservation(args.id)
		},
	},
}
