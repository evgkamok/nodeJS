import { WebSocket, WebSocketServer } from 'ws'
import { Room } from '../types/index.js'
import { PlayerManager } from '../models/PlayerManager.js'
import { RoomManager } from '../models/RoomManager.js'
import { broadcastRoomUpdates } from '../utils/broadcast.js'

export function createRoomHandler(
	ws: WebSocket,
	playerManager: PlayerManager,
	roomManager: RoomManager,
	wss: WebSocketServer
) {
	const player = playerManager.getPlayerByWs(ws)

	if (!player) {
		console.log('Not found player for create room')
		return
	}

	const room: Room = roomManager.createRoom(player)

	broadcastRoomUpdates(wss, roomManager)
}
