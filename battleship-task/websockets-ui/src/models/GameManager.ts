import { AddShipData, AttackData, Room, Ship } from '../types/index.js'
import { randomUUID } from 'crypto'
import { Game } from '../types/index.js'
import { WebSocket, WebSocketServer } from 'ws'
import { StoreDb } from '../store/store.js'

export class GameManager {
	private games: Map<string, Game> = new Map()

	createGame(room: Room, DB: StoreDb) {
		const idGame = randomUUID().substring(0, 4)

		room.roomUsers.forEach(user => {
			const createGameMessage = {
				type: 'create_game',
				data: JSON.stringify({
					idGame,
					idPlayer: user.index,
				}),
				id: 0,
			}

			const player = DB.usersManager.getUserById(user.index)
			if (player) player.ws.send(JSON.stringify(createGameMessage))
		})

		this.games.set(idGame, {
			roomId: room.roomId,
			playersInGame: [],
			currentPlayer: null,
		})
	}

	playerReadyToPlay(shipData: AddShipData, ws: WebSocket) {
		const { gameId, ships, indexPlayer } = shipData

		const existingGame = this.games.get(gameId)

		if (!existingGame) return

		existingGame.playersInGame.push({
			indexPlayer,
			ships,
			ws,
		})

		this.startGame(indexPlayer, ships, ws)

		if (existingGame.playersInGame.length === 2) {
			const firstPlayerTurn = existingGame.playersInGame[0].indexPlayer
			existingGame.currentPlayer = firstPlayerTurn

			existingGame.playersInGame.forEach(player => {
				this.sendTurn(firstPlayerTurn, player.ws)
			})
		}
	}

	startGame(indexPlayer: string, ships: Ship[], ws: WebSocket) {
		const startGameMessage = {
			type: 'start_game',
			data: JSON.stringify({
				ships,
				currentPlayerIndex: indexPlayer,
			}),
			id: 0,
		}
		ws.send(JSON.stringify(startGameMessage))
	}

	sendTurn(currentPlayer: string, ws: WebSocket) {
		const turnMessage = {
			type: 'turn',
			data: JSON.stringify({
				currentPlayer,
			}),
			id: 0,
		}
		ws.send(JSON.stringify(turnMessage))
	}

	sendAttack(attackData: AttackData) {
		const { x, y, gameId, indexPlayer } = attackData

		const game = this.games.get(gameId)

		if (!game) return
		if (game.currentPlayer !== indexPlayer) return

		const currentPlayer = game.playersInGame.find(
			player => player.indexPlayer === indexPlayer
		)

		const enemyPlayer = game.playersInGame.find(
			player => player.indexPlayer !== indexPlayer
		)

		if (!currentPlayer || !enemyPlayer) return

		const cellAttack = { x, y }

		const attackResult = this.checkHit(enemyPlayer.ships, cellAttack)

		const attackMessage = {
			type: 'attack',
			data: JSON.stringify({
				position: cellAttack,
				currentPlayer: currentPlayer.indexPlayer,
				status: attackResult,
			}),
			id: 0,
		}

		currentPlayer.ws.send(JSON.stringify(attackMessage))
		enemyPlayer.ws.send(JSON.stringify(attackMessage))

		const isHit = attackResult === 'killed' || attackResult === 'shot'
		const nextPlayer = isHit
			? currentPlayer.indexPlayer
			: enemyPlayer.indexPlayer

		this.sendTurn(nextPlayer, currentPlayer.ws)
		this.sendTurn(nextPlayer, enemyPlayer.ws)

		if (!isHit) {
			game.currentPlayer = enemyPlayer.indexPlayer
		}

		// if (attackResult === 'killed') {
		// 	this.checkFinishGame(game, currentPlayer, enemyPlayer, context)
		// }
	}

	private checkHit(ships: Ship[], cellAttack: { x: number; y: number }) {
		for (const ship of ships) {
			const shipCells = this.getShipCells(ship)

			const isHit = shipCells.some(
				cell => cell.x === cellAttack.x && cell.y === cellAttack.y
			)
			if (!isHit) continue

			if (!ship.hits) ship.hits = new Set()

			const cellKey = `${cellAttack.x}, ${cellAttack.y}`

			if (ship.hits.has(cellKey)) return 'already_hit'

			ship.hits.add(cellKey)

			const isKilled = ship.hits.size === ship.length
			return isKilled ? 'killed' : 'shot'
		}

		return 'miss'
	}

	private getShipCells(ship: Ship): Array<{ x: number; y: number }> {
		const shipCells = []
		const { x, y } = ship.position

		for (let i = 0; i < ship.length; i++) {
			shipCells.push({
				x: ship.direction ? x : x + i,
				y: ship.direction ? y + i : y,
			})
		}

		return shipCells
	}

	// private checkFinishGame(
	// 	game: Game,
	// 	currentPlayer: PlayerInGame,
	// 	enemyPlayer: PlayerInGame,
	// 	context: ServerContext
	// ) {
	// 	const isFinishedGame = enemyPlayer.ships.every(
	// 		ship => ship.length === ship.hits?.size
	// 	)

	// 	if (isFinishedGame) {
	// 		const finishGameMessage = {
	// 			type: 'finish',
	// 			data: JSON.stringify({
	// 				winPlayer: currentPlayer.indexPlayer,
	// 			}),
	// 			id: 0,
	// 		}

	// 		game.players.forEach(player => {
	// 			player.ws.send(JSON.stringify(finishGameMessage))
	// 		})

	// 		this.games.delete(game.gameId)
	// 		context.roomManager.closeRoom(game.roomId, context.wss)
	// 	}

	// 	return
	// }
}
