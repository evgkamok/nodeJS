import { WebSocket } from 'ws'
import { AddShipData, ClientMessage } from '../types/index.js'
import { ServerContext } from '../ServerContext.js'

export function addShipsHandler(
	message: ClientMessage,
	ws: WebSocket,
	context: ServerContext
) {
	const shipData: AddShipData = JSON.parse(message.data)

	if (!shipData) {
		console.log(`type: add_ships, error receive data`)
		return
	}

	context.gameManager.readyToPlayGame(shipData, ws)
}
