import { WebSocket } from 'ws'
import { AttackData, Message } from '../types/index.js'
import { StoreDb } from '../store/store.js'

export function attackHandler(
	message: Message,
	DB: StoreDb,
	ws: WebSocket
) {
	const attackData: AttackData = JSON.parse(message.data)

	DB.gameManager.sendAttack(attackData)
}
