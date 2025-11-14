import { WebSocketServer } from 'ws'

export function createWebSocketServer(port) {
	const wss = new WebSocketServer({ port })

	wss.on('connection', ws => {
		console.log('New client connection')

		ws.on('message', message => {
			console.log('Received message is ', message.toString())

			try {
				const data = JSON.parse(message.toString())
				console.log('Parsed data:', data)
			} catch (error) {
				console.error('Error message:', error)
			}
		})

		ws.on('error', error => {
			console.log('Websocket error - ', error)
		})

		ws.on('close', () => {
			console.log('Client disconnect')
		})
	})
}
