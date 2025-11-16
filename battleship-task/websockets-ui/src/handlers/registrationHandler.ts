import { PlayerManager } from './../models/PlayerManager.js'
import { ClientMessage, Player, RegistrationData } from '../types/index.js'
import { WebSocket } from 'ws'

function sendSuccessResponse(ws: WebSocket, player: Player): void {
	const response = {
		type: 'reg',
		data: JSON.stringify({
			name: player.name,
			index: player.index,
			error: false,
			errorText: '',
		}),
		id: 0,
	}

	ws.send(JSON.stringify(response))
}

function loginPlayer(
	regPlayerData: RegistrationData,
	ws: WebSocket,
	playerManager: PlayerManager
): Player | null {
	const { name, password } = regPlayerData
	const existsPlayer = playerManager.loginPlayer(name, password)

	if (existsPlayer) {
		playerManager.updatePlayerConnection(existsPlayer.index, ws)
		return existsPlayer
	}

	return null
}

function registerNewPlayer(
	regPlayerData: RegistrationData,
	ws: WebSocket,
	playerManager: PlayerManager
): Player {
	const { name, password } = regPlayerData

	return playerManager.addPlayer(name, password, ws)
}

export function handleRegistration(
	message: ClientMessage,
	ws: WebSocket,
	playerManager: PlayerManager
): void {
	try {
		const regData: RegistrationData = JSON.parse(message.data)

		let player = loginPlayer(regData, ws, playerManager)

		if (!player) {
			player = registerNewPlayer(regData, ws, playerManager)
		}

		sendSuccessResponse(ws, player)
		console.log(`Success authorize - ${player.name}`)
	} catch (error) {
		console.error(`Error handle for request type = REG`)
		ws.send(
			JSON.stringify({
				type: 'reg',
				data: {
					name: '',
					index: -1,
					error: true,
					errorText: 'Error login/registration player',
				},
				id: 0,
			})
		)
	}
}
