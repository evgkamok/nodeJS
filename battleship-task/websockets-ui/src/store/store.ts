import WebSocket, { WebSocketServer } from 'ws'
import { GameManager } from '../models/GameManager.js'
import { RoomManager } from '../models/RoomManager.js'
import { UsersManager } from '../models/UsersManager.js'

export type StoreDb = {
	usersManager: UsersManager
	roomManager: RoomManager
	gameManager: GameManager
	ws: Map<string, WebSocket>
	wss?: WebSocketServer
}

export const DB: StoreDb = {
	usersManager: new UsersManager(),
	roomManager: new RoomManager(),
	gameManager: new GameManager(),
	ws: new Map<string, WebSocket>(),
}
