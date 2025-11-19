import { AddShipData, Ship } from '../types/index.js'
import { randomUUID } from 'crypto'

import { RoomManager } from '../models/RoomManager.js'
import { WebSocket, WebSocketServer } from 'ws'

interface PlayerInGame {
	indexPlayer: number
	ships: Ship[]
	ws: WebSocket
}

interface Game {
	gameId: string
	players: PlayerInGame[]
}

export class GameManager {
	private games: Map<string, Game> = new Map()

	readyToPlayGame(shipData: AddShipData, ws: WebSocket) {
		const { gameId, ships, indexPlayer } = shipData

		const existingGame = this.games.get(gameId)

		if (existingGame) {
			existingGame.players.push({
				indexPlayer,
				ships,
				ws,
			})

			if (existingGame.players.length === 2) {
				existingGame.players.forEach(player => {
					this.startGame(player.ws, player.ships, player.indexPlayer)
				})
			}
		} else {
			this.games.set(gameId, {
				gameId,
				players: [
					{
						indexPlayer,
						ships,
						ws,
					},
				],
			})
		}
	}

	createGame(
		indexRoom: string,
		roomManager: RoomManager,
		wss: WebSocketServer
	) {
		const room = roomManager.getRoomById(indexRoom)
		if (!room) {
			console.log(`Error - room id - ${indexRoom}, not found`)
			return
		}

		const idGame = randomUUID().substring(0, 4)

		if (room.roomUsers.length === 2) {
			room.roomUsers.forEach(user => {
				const createGameMessage = {
					type: 'create_game',
					data: JSON.stringify({
						idGame,
						idPlayer: user.index,
					}),
					id: 0,
				}
				user.ws.send(JSON.stringify(createGameMessage))
				console.log(`type:create_game, send to player - ${user.name}`)
			})
		}

		roomManager.sendRoomUpdate(wss)
	}

	startGame(ws: WebSocket, ships: Ship[], indexPlayer: number) {
		const startGameMessage = {
			type: 'start_game',
			data: {
				ships,
				currentPlayerIndex: indexPlayer,
			},
			id: 0,
		}
		ws.send(JSON.stringify(startGameMessage))
	}
}
