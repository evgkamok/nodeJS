import { WebSocket } from 'ws'
import { Room } from '../types/index.js'
import { broadcastRoomUpdates } from '../utils/broadcast.js'
import { ServerContext } from '../ServerContext.js'

export function createRoomHandler(ws: WebSocket, context: ServerContext) {
	const player = context.playerManager.getPlayerByWs(ws)

	if (!player) {
		console.log('Not found player for create room')
		return
	}

	const room: Room = context.roomManager.createRoom(player)

	broadcastRoomUpdates(context.wss, context.roomManager)
}
