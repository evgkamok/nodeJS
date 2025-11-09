import { IncomingMessage } from 'http'

export function parseBody(req: IncomingMessage): Promise<any> {
	return new Promise((resolve, reject) => {
		let body = ''

		req.on('data', (chunk: Buffer) => {
			body += chunk.toString()
		})

		req.on('end', () => {
			try {
				const parsed = body ? JSON.stringify(body) : {}
				resolve(parsed)
			} catch (error) {
				reject(new Error('Invalid JSON'))
			}
		})

		req.on('error', error => {
			reject(error)
		})
	})
}
