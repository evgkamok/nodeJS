import { WebSocket } from 'ws'
import { ServerContext } from '../ServerContext.js'
import { ClientMessage } from '../types/index.js'

export function addPlayerToRoomHandler(
	message: ClientMessage,
	ws: WebSocket,
	context: ServerContext
): void {
	const { indexRoom } = JSON.parse(message.data)
	const player = context.playerManager.getPlayerByWs(ws)

	if (!player) {
		console.log('Add player to room failed. Player not found')
		return
	}

	context.roomManager.addPlayerToRoom(indexRoom, player, context)
}
