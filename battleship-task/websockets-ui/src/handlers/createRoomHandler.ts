import { WebSocket } from 'ws'
import { ServerContext } from '../ServerContext.js'

export function createRoomHandler(
	ws: WebSocket,
	context: ServerContext
): void {
	try {
		const playerRoomCreator = context.playerManager.getPlayerByWs(ws)

		if (playerRoomCreator) {
			context.roomManager.createRoom(playerRoomCreator, context)
		}
	} catch (error) {
		console.log('Create room error - ', error)
	}
}
