import { ServerContext } from './../ServerContext.js'
import { WebSocket } from 'ws'
import { ClientMessage } from '../types/index.js'

export function attackHandler(
	message: ClientMessage,
	ws: WebSocket,
	serverContext: ServerContext
) {
	const attackData = JSON.parse(message.data)

	serverContext.gameManager.sendAttack(attackData, ws)

	// const attackMessage = {
	// 	type: 'attack',
	// 	data: JSON.stringify({
	// 		position: {
	// 			x,
	// 			y,
	// 		},
	// 		currentPlayer: indexPlayer,
	// 		status: 'miss',
	// 	}),
	// 	id: 0,
	// }

	// ws.send(JSON.stringify(attackMessage))
}

// { x: 2, y: 0, gameId: 'f247', indexPlayer: 1763547408268 }
