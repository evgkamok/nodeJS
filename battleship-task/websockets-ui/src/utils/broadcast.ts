import { WebSocketServer } from 'ws'
import { RoomManager } from '../models/RoomManager.js'

export function broadcastRoomUpdates(
	wss: WebSocketServer,
	roomManager: RoomManager
): void {
	const roomsWithOnePlayer = roomManager.getRoomsInfo()

	const message = {
		type: 'update_room',
		data: JSON.stringify(roomsWithOnePlayer),
		id: 0,
	}

	const messageStr = JSON.stringify(message)

	wss.clients.forEach(client => {
		if (client.readyState === 1) {
			client.send(messageStr)
		}
	})

	console.log(`Update send for ${wss.clients.size} clients`)
}
