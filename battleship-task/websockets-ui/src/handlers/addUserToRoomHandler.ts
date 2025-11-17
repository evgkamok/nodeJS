import { WebSocket, WebSocketServer } from 'ws'
import { ClientMessage } from '../types/index.js'
import { PlayerManager } from '../models/PlayerManager.js'
import { RoomManager } from '../models/RoomManager.js'
import { createGameHandler } from '../handlers/createGameHandler.js'

export function addUserToRoomHandler(
	message: ClientMessage,
	ws: WebSocket,
	playerManager: PlayerManager,
	roomManager: RoomManager,
	wss: WebSocketServer
): void {
	const data = JSON.parse(message.data)
	const player = playerManager.getPlayerByWs(ws)

	if (!player) {
		console.log('Add user to room failed. Player not found')
		return
	}

	const success = roomManager.addPlayerToRoom(data.indexRoom, player)

	if (!success) {
		console.log(
			`Add user to room failed. Player ${player.name} can't connect to this room`
		)
		return
	}

	createGameHandler(data.indexRoom, roomManager, wss)
}
