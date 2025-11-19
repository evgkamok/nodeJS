import { WebSocketServer } from 'ws'
import { PlayerManager } from './models/PlayerManager.js'
import { RoomManager } from './models/RoomManager.js'
import { GameManager } from './models/GameManager.js'

export class ServerContext {
	constructor(
		public wss: WebSocketServer,
		public playerManager: PlayerManager,
		public roomManager: RoomManager,
		public gameManager: GameManager
	) {}
}
