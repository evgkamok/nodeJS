import { StoreDb } from '../store/store.js'
import { Message, UserRegisterRequest } from '../types/index.js'
import { WebSocket } from 'ws'
import { randomUUID } from 'crypto'

export function regUserHandler(
	message: Message,
	DB: StoreDb,
	ws: WebSocket
) {
	const regData: UserRegisterRequest = JSON.parse(message.data)
	const { name, password } = regData
	const isNameTaken = DB.usersManager.isNameTaken(name)

	if (!isNameTaken && DB.wss) {
		const userIndex = randomUUID().substring(0, 8)
		DB.usersManager.regNewUser(userIndex, name, password, ws)
		DB.roomManager.updateRoom(DB.wss)
		// DB.usersManager.updateWinners(DB.wss)
	} else {
		DB.usersManager.regNewUserError(name, 'This name already exists', ws)
	}
}
