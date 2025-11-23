import WebSocket from 'ws'
import { Message, User } from '../types/index.js'

export class UsersManager {
	private users: Map<string, User> = new Map()

	regNewUser(
		userIndex: string,
		username: string,
		password: string,
		ws: WebSocket
	) {
		this.users.set(userIndex, {
			index: userIndex,
			name: username,
			password,
			ws,
		})

		const regMessage: Message = {
			type: 'reg',
			data: JSON.stringify({
				name: username,
				index: userIndex,
				error: false,
				errorText: '',
			}),
			id: 0,
		}

		console.log(`${username} - user successfully authorized`)
		ws.send(JSON.stringify(regMessage))
	}

	regNewUserError(username: string, errorText: string, ws: WebSocket) {
		const regMessage: Message = {
			type: 'reg',
			data: JSON.stringify({
				name: username,
				index: -1,
				error: true,
				errorText,
			}),
			id: 0,
		}

		ws.send(JSON.stringify(regMessage))
	}

	isNameTaken(username: string) {
		for (const user of this.users.values()) {
			if (user.name === username) {
				return true
			}
		}
		return false
	}
}
