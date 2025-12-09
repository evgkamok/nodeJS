import { WebSocket } from 'ws'
import { Message } from '../types/index.js'
import { StoreDb } from '../store/store.js'

export function addUserToRoomHandler(
	message: Message,
	DB: StoreDb,
	ws: WebSocket
) {
	const { indexRoom } = JSON.parse(message.data)
	const user = DB.usersManager.getUserByWs(ws)

	if (!user) {
		console.log(`❌ add user to room failed`)
		return
	}

	DB.roomManager.addUserToRoom(indexRoom, user, DB)
}
