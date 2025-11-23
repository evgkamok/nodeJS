import { StoreDb } from './../store/store.js'
import { WebSocket } from 'ws'
import { User } from '../types/index.js'

export function createRoomHandler(DB: StoreDb, ws: WebSocket) {
	const user: User | undefined = DB.usersManager.getUserByWs(ws)

	if (user && DB.wss) {
		DB.roomManager.createRoom(user)
		DB.roomManager.updateRoom(DB.wss)
	}
}
