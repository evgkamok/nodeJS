import { IncomingMessage } from 'http'

export function parseBody(req: IncomingMessage): Promise<any> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []

		req.on('data', (chunk: Buffer) => {
			chunks.push(chunk)
		})

		req.on('end', () => {
			try {
				const buffer = Buffer.concat(chunks)
				const bodyString = buffer.toString('utf-8')
				const parsed = JSON.parse(bodyString)

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
