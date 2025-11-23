import { ServerContext } from './../ServerContext.js'
import { WebSocket } from 'ws'
import { AttackData, ClientMessage } from '../types/index.js'

export function attackHandler(
	message: ClientMessage,
	ws: WebSocket,
	serverContext: ServerContext
) {
	const attackData: AttackData = JSON.parse(message.data)

	serverContext.gameManager.sendAttack(attackData, serverContext)
}
