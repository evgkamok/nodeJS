import WebSocket, { WebSocketServer } from 'ws'
import { GameManager } from '../models/GameManager.js'
import { PlayerManager } from '../models/PlayerManager.js'
import { RoomManager } from '../models/RoomManager.js'
import { UsersManager } from '../models/UsersManager.js'

export type StoreDb = {
	usersManager: UsersManager
	playerManager: PlayerManager
	roomManager: RoomManager
	gameManager: GameManager
	ws: Map<string, WebSocket>
	wss?: WebSocketServer
}

export const DB: StoreDb = {
	usersManager: new UsersManager(),
	playerManager: new PlayerManager(),
	roomManager: new RoomManager(),
	gameManager: new GameManager(),
	ws: new Map<string, WebSocket>(),
}
