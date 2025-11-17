import { httpServer } from './src/http_server/index.js'
import { WebSocketServer } from 'ws'
import { ClientMessage } from './src/types/index.js'

import { registrationUserHandler } from './src/handlers/registrationHandler.js'
import { createRoomHandler } from './src/handlers/createRoomHandler.js'
import { addUserToRoomHandler } from './src/handlers/addUserToRoomHandler.js'

import { PlayerManager } from './src/models/PlayerManager.js'
import { RoomManager } from './src/models/RoomManager.js'

const HTTP_PORT = 8181
const WS_PORT = 3000

console.log(`🚀 Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: WS_PORT })
console.log(`🚀 Start ws-server launched on the ws://localhost:${WS_PORT}`)

const playerManager = new PlayerManager()
const roomManager = new RoomManager()

wss.on('connection', ws => {
	console.log('New client connected...')

	ws.on('message', data => {
		const message: ClientMessage = JSON.parse(data.toString())

		console.log(`Received type - ${message.type}`)

		switch (message.type) {
			case 'reg':
				registrationUserHandler(message, ws, playerManager)
				break
			case 'create_room':
				createRoomHandler(ws, playerManager, roomManager, wss)
				break
			case 'add_user_to_room':
				addUserToRoomHandler(message, ws, playerManager, roomManager, wss)
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
