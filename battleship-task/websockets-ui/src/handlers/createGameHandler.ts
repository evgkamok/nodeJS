import { randomUUID } from 'crypto'

import { broadcastRoomUpdates } from '../utils/broadcast.js'
import { RoomManager } from '../models/RoomManager.js'
import { WebSocketServer } from 'ws'

export function createGameHandler(
	indexRoom: string,
	roomManager: RoomManager,
	wss: WebSocketServer
) {
	const room = roomManager.getRoomById(indexRoom)

	if (!room) {
		return
	}

	const idGame = randomUUID().substring(0, 4)

	if (room.roomUsers.length === 2) {
		room.roomUsers.forEach(user => {
			const message = {
				type: 'create_game',
				data: JSON.stringify({
					idGame,
					idPlayer: user.index,
				}),
				id: 0,
			}

			user.ws.send(JSON.stringify(message))
			console.log(`create_game send player - ${user.name}`)
		})
	}

	broadcastRoomUpdates(wss, roomManager)
}
