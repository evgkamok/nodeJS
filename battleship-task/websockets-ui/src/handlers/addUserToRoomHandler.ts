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

	const isConnected = context.roomManager.addPlayerToRoom(
		indexRoom,
		player
	)

	if (isConnected) {
		console.log(
			`Player ${player.name} successfully connected to the room ${indexRoom}`
		)
	} else {
		console.log(
			`Player ${player.name} failed to connected to the room ${indexRoom}`
		)
	}

	context.gameManager.createGame(
		indexRoom,
		context.roomManager,
		context.wss
	)
}
