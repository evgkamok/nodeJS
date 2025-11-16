import { httpServer } from './src/http_server/index.js'
import { WebSocketServer } from 'ws'
import { handleRegistration } from './src/handlers/registrationHandler.js'
import { PlayerManager } from './src/models/PlayerManager.js'
import { ClientMessage } from './src/types/index.js'

const HTTP_PORT = 8181
const WS_PORT = 3000

console.log(`🚀 Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: WS_PORT })
console.log(`🚀 Start ws-server launched on the ws://localhost:${WS_PORT}`)

const playerManager = new PlayerManager()

wss.on('connection', ws => {
	console.log('New client connected...')

	ws.on('message', data => {
		const message: ClientMessage = JSON.parse(data.toString())

		console.log(`Received type - ${message.type}`)

		switch (message.type) {
			case 'reg':
				handleRegistration(message, ws, playerManager)
				break

			default:
				console.log(`Unknown type - ${message.type}`)
		}
	})

	ws.on('close', () => {
		console.log('Client disconnect')
	})

	ws.on('error', error => {
		console.error('WebSocket error : ', error)
	})
})
