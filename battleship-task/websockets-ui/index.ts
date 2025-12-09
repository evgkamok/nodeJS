import { httpServer } from './src/http_server/index.js'
import { WebSocketServer } from 'ws'
import { Message } from './src/types/index.js'

import { regUserHandler } from './src/handlers/regUserHandler.js'
import { createRoomHandler } from './src/handlers/createRoomHandler.js'
import { addUserToRoomHandler } from './src/handlers/addUserToRoomHandler.js'
import { addShipsHandler } from './src/handlers/addShipsHandler.js'
import { attackHandler } from './src/handlers/attackHandler.js'

import { DB } from './src/store/store.js'

const HTTP_PORT = 8181
const WS_PORT = 3000

console.log(`🚀 start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: WS_PORT })
DB.wss = wss
console.log(`🚀 start ws-server launched on the ws://localhost:${WS_PORT}`)

// const playerManager = new PlayerManager()
// const roomManager = new RoomManager()
// const gameManager = new GameManager()

// const serverContext = new ServerContext(
// 	wss,
// 	playerManager,
// 	roomManager,
// 	gameManager
// )

wss.on('connection', ws => {
	console.log('모 new client connected...')
	DB.ws.set('ws', ws)

	ws.on('message', data => {
		const clientMessage: Message = JSON.parse(data.toString())

		console.log(`received type ➤ ${clientMessage.type}`)

		switch (clientMessage.type) {
			case 'reg':
				regUserHandler(clientMessage, DB, ws)
				break
			case 'create_room':
				createRoomHandler(DB, ws)
				break
			case 'add_user_to_room':
				addUserToRoomHandler(clientMessage, DB, ws)
				break
			case 'add_ships':
				addShipsHandler(clientMessage, DB, ws)
				break
			case 'attack':
				attackHandler(clientMessage, DB, ws)
				break
			default:
				console.log(`Unknown type - ${clientMessage.type}`)
		}
	})

	ws.on('close', () => {
		console.log('Client disconnect')
	})

	ws.on('error', error => {
		console.error('WebSocket error : ', error)
	})
})
