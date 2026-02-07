import { z } from 'zod'
import { ValidationError } from './shared/errors.js'

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data)

	if (!result.success) {
		const messages = result.error.issues.map(err => {
			const path = err.path.length > 0 ? `${err.path.join('.')}` : ''
			return `${path}${err.message}`
		})

		throw new ValidationError(messages.join('; '))
	}

	return result.data
}
