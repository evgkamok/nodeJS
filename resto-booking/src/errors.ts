export class AppError extends Error {
	constructor(
		message: string,
		public code: string = 'INTERNAL_SERVER_ERROR'
	) {
		super(message)
		this.name = 'AppError'
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 'VALIDATION_ERROR')
		this.name = 'ValidationError'
	}
}
