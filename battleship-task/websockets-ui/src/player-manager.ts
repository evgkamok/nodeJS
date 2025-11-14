import { Player, WSMessage } from './types'

export class PlayerManager {
	private players: Map<string, Player> = new Map()

	// login || registration
	register(name: string, password: string, ws: any): WSMessage {
		const existPlayer = this.players.get(name)

		if (existPlayer) {
			if (existPlayer.password === password) {
				return {
					id: 0,
					type: 'reg',
					data: {
						name: existPlayer.name,
						index: existPlayer.index,
					},
				}
			} else {
				return {
					id: 0,
					type: 'reg',
					data: {
						name,
						index: 0,
						error: true,
						errorText: 'Invalid password',
					},
				}
			}
		} else {
			const newPlayer: Player = {
				name,
				password,
				index: Date.now().toString(),
				wins: 0,
				ws,
			}
			this.players.set(name, newPlayer)

			return {
				type: 'reg',
				data: {
					name: newPlayer.name,
					index: newPlayer.index,
					error: false,
					errorText: '',
				},
				id: 0,
			}
		}
	}
}
