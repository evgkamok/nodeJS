import { Player } from '../types/index.js'
import { WebSocket } from 'ws'

export class PlayerManager {
	private players: Map<number, Player> = new Map()

	addPlayer(name: string, password: string, ws: WebSocket): Player {
		const newPlayer: Player = {
			index: Date.now(),
			name,
			password,
			ws,
		}

		this.players.set(newPlayer.index, newPlayer)
		console.log(`New player has been added: ${name} (ID: ${newPlayer.index})`)
		return newPlayer
	}

	loginPlayer(name: string, password: string): Player | undefined {
		for (const player of this.players.values()) {
			if (name === player.name && password === player.password) {
				return player
			}
		}
		return undefined
	}

	getPlayer(index: number): Player | undefined {
		return this.players.get(index)
	}

	updatePlayerConnection(index: number, ws: WebSocket): void {
		const player = this.players.get(index)
		if (player) {
			player.ws = ws
			console.log(`Refresh ws connection for player with name - ${player.name}`)
		}
	}
}
