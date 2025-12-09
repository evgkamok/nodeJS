import { StoreDb } from './../store/store.js'
import { WebSocket } from 'ws'
import { AddShipData, Message } from '../types/index.js'

export function addShipsHandler(
	message: Message,
	DB: StoreDb,
	ws: WebSocket
) {
	const shipData: AddShipData = JSON.parse(message.data)

	if (!shipData) {
		console.log(`type: add_ships - error receive data`)
		return
	}

	DB.gameManager.playerReadyToPlay(shipData, ws)
}
