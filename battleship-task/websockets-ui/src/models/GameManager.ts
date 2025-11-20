import { AddShipData, AttackData, Room, Ship } from '../types/index.js'
import { randomUUID } from 'crypto'

import { RoomManager } from '../models/RoomManager.js'
import { WebSocket, WebSocketServer } from 'ws'
import { PlayerManager } from './PlayerManager.js'

interface PlayerInGame {
	indexPlayer: number
	ships: Ship[]
	hits: Set<string> | null
	miss: Set<string> | null
	ws: WebSocket
}

interface Game {
	gameId: string
	players: PlayerInGame[]
	currentPlayer: number
}

export class GameManager {
	private games: Map<string, Game> = new Map()

	createGame(room: Room, playerManager: PlayerManager) {
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
				const player = playerManager.getPlayerById(user.index)

				if (player) {
					player.ws.send(JSON.stringify(createGameMessage))
				}
			})
		}
	}

	readyToPlayGame(shipData: AddShipData, ws: WebSocket) {
		const { gameId, ships, indexPlayer } = shipData

		const existingGame = this.games.get(gameId)

		if (existingGame) {
			existingGame.players.push({
				indexPlayer,
				ships,
				ws,
				hits: null,
				miss: null,
			})

			existingGame.players.forEach(player => {
				this.startGame(player.ws, player.ships, player.indexPlayer)
			})

			existingGame.players.forEach(player => {
				this.sendTurn(player.ws, existingGame.currentPlayer)
			})
		} else {
			this.games.set(gameId, {
				gameId,
				players: [
					{
						indexPlayer,
						ships,
						ws,
						hits: null,
						miss: null,
					},
				],
				currentPlayer: indexPlayer,
			})
		}
	}

	startGame(ws: WebSocket, ships: Ship[], currentPlayerIndex: number) {
		const startGameMessage = {
			type: 'start_game',
			data: JSON.stringify({
				ships,
				currentPlayerIndex,
			}),
			id: 0,
		}
		ws.send(JSON.stringify(startGameMessage))
	}

	sendTurn(ws: WebSocket, currentPlayer: number) {
		console.log('currentPlayer', currentPlayer)
		const turnMessage = {
			type: 'turn',
			data: JSON.stringify({
				currentPlayer,
			}),
			id: 0,
		}
		ws.send(JSON.stringify(turnMessage))
	}

	sendAttack(attackData: AttackData, ws: WebSocket) {
		const { x, y, gameId, indexPlayer } = attackData

		const currentGame = this.games.get(gameId)

		const enemyPlayer = currentGame?.players.find(
			player => player.indexPlayer !== indexPlayer
		)

		const cellAttack = `${x}, ${y}`

		if (
			enemyPlayer?.miss?.has(cellAttack) ||
			enemyPlayer?.hits?.has(cellAttack)
		) {
			console.log(`This cell - ${cellAttack} was attacked earlier`)
			return
		}

		if (indexPlayer !== currentGame?.currentPlayer) {
			return
		}

		if (enemyPlayer) {
			for (const ship of enemyPlayer?.ships.values()) {
				const shipX = ship.position.x
				const shipY = ship.position.y
				const shipXY = `${shipX}, ${shipY}`

				console.log('CELL Attack', cellAttack)
				console.log('ENEMY shipXY', shipXY)

				if (cellAttack === shipXY) {
					console.log('POPAL')
				}
			}
		}
	}
}

/* 
  indexPlayer: 1763655674970,
  ships: [
    { position: [Object], direction: false, type: 'huge', length: 4 },
    { position: [Object], direction: false, type: 'large', length: 3 },
    { position: [Object], direction: true, type: 'large', length: 3 },
    { position: [Object], direction: false, type: 'medium', length: 2 },
    { position: [Object], direction: false, type: 'medium', length: 2 },
    { position: [Object], direction: false, type: 'medium', length: 2 },
    { position: [Object], direction: true, type: 'small', length: 1 },
    { position: [Object], direction: false, type: 'small', length: 1 },
    { position: [Object], direction: false, type: 'small', length: 1 },
    { position: [Object], direction: true, type: 'small', length: 1 }
*/

// [
// {
//   position: { x: 3, y: 5 },
//   direction: true, NOS
//   type: 'huge',
//   length: 4
// },
// {
//   position: { x: 4, y: 1 },
//   direction: false, ASS
//   type: 'large',
//   length: 3
// },
//   {
//     position: { x: 0, y: 1 },
//     direction: false,
//     type: 'large',
//     length: 3
//   },
//   {
//     position: { x: 1, y: 7 },
//     direction: true,
//     type: 'medium',
//     length: 2
//   },
//   {
//     position: { x: 5, y: 5 },
//     direction: true,
//     type: 'medium',
//     length: 2
//   },
//   {
//     position: { x: 5, y: 8 },
//     direction: true,
//     type: 'medium',
//     length: 2
//   },
//   {
//     position: { x: 5, y: 3 },
//     direction: true,
//     type: 'small',
//     length: 1
//   },
//   {
//     position: { x: 3, y: 3 },
//     direction: true,
//     type: 'small',
//     length: 1
//   },
//   {
//     position: { x: 8, y: 1 },
//     direction: false,
//     type: 'small',
//     length: 1
//   },
//   {
//     position: { x: 8, y: 3 },
//     direction: true,
//     type: 'small',
//     length: 1
//   }
// ]
