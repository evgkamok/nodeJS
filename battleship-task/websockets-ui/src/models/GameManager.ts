import { AddShipData, AttackData, Room, Ship } from '../types/index.js'
import { randomUUID } from 'crypto'
import { Game } from '../types/index.js'
import { WebSocket } from 'ws'
import { PlayerManager } from './PlayerManager.js'
import { ServerContext } from '../ServerContext.js'

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
		const turnMessage = {
			type: 'turn',
			data: JSON.stringify({
				currentPlayer,
			}),
			id: 0,
		}
		ws.send(JSON.stringify(turnMessage))
	}

	sendAttack(attackData: AttackData, serverContext: ServerContext) {
		const { x, y, gameId, indexPlayer } = attackData

		const game = this.games.get(gameId)

		if (!game) return
		if (game.currentPlayer !== indexPlayer) return

		const currentPlayer = game.players.find(
			player => player.indexPlayer === indexPlayer
		)

		const enemyPlayer = game.players.find(
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

		const isHit = attackResult === 'killed' || 'shot'
		const nexPlayer = isHit
			? currentPlayer.indexPlayer
			: enemyPlayer.indexPlayer

		this.sendTurn(currentPlayer.ws, nexPlayer)
		this.sendTurn(enemyPlayer.ws, nexPlayer)

		if (!isHit) {
			game.currentPlayer = enemyPlayer.indexPlayer
		}
	}

	private checkHit(ships: Ship[], cellAttack: { x: number; y: number }) {
		for (const ship of ships) {
			const shipCells = this.getShipCells(ship)

			const hitCell = shipCells.find(
				cell => cell.x === cellAttack.x && cell.y === cellAttack.y
			)

			if (!hitCell) continue

			if (!ship.hits) ship.hits = new Set()

			const cellKey = `${cellAttack.x}, ${cellAttack.y}`

			if (hitCell) {
				if (ship.hits.has(cellKey)) return 'already_hit'

				ship.hits.add(cellKey)
				const isKilled = ship.hits.size === ship.length
				return isKilled ? 'killed' : 'shot'
			}
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
}
