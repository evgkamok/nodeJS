import { WebSocket } from 'ws'
import { ServerContext } from '../ServerContext.js'
import { ClientMessage } from '../types/index.js'
import { createGameHandler } from '../handlers/createGameHandler.js'

export function addUserToRoomHandler(
	message: ClientMessage,
	ws: WebSocket,
	context: ServerContext
): void {
	const data = JSON.parse(message.data)
	const player = context.playerManager.getPlayerByWs(ws)

	if (!player) {
		console.log('Add user to room failed. Player not found')
		return
	}

	const success = context.roomManager.addPlayerToRoom(data.indexRoom, player)

	if (!success) {
		console.log(
			`Add user to room failed. Player ${player.name} can't connect to this room`
		)
		return
	}

	createGameHandler(data.indexRoom, context.roomManager, context.wss)
}
