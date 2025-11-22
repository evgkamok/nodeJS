import { WebSocketServer } from 'ws'
import { Player, Room } from '../types/index.js'
import { ServerContext } from '../ServerContext.js'
import { randomUUID } from 'crypto'

export class RoomManager {
	private rooms: Map<string, Room> = new Map()

	createRoom(playerRoomCreator: Player, context: ServerContext) {
		const roomId = randomUUID().substring(0, 8)
		const { name, index } = playerRoomCreator

		const room: Room = {
			roomId,
			roomUsers: [{ index, name }],
		}

		this.rooms.set(roomId, room)

		this.sendRoomUpdate(context.wss)

		console.log(`Room ${roomId}, has been created by player - ${name}`)
	}

	closeRoom(roomId: string, wss: WebSocketServer) {
		this.rooms.delete(roomId)
		this.sendRoomUpdate(wss)
	}

	sendRoomUpdate(wss: WebSocketServer): void {
		const roomsWithOnePlayer: Room[] = []
		console.log('UPDATE ROOM')
		for (const room of this.rooms.values()) {
			if (room.roomUsers.length === 1) {
				roomsWithOnePlayer.push({
					roomId: room.roomId,
					roomUsers: [...room.roomUsers],
				})
			}
		}

		if (roomsWithOnePlayer.length > 0) {
			const updateMessage = {
				type: 'update_room',
				data: JSON.stringify(roomsWithOnePlayer),
				id: 0,
			}

			wss.clients.forEach(player => {
				if (player.readyState === 1) {
					player.send(JSON.stringify(updateMessage))
				}
			})
		}
	}

	addPlayerToRoom(roomId: string, player: Player, context: ServerContext) {
		const { wss, gameManager, playerManager } = context
		const room = this.getRoomById(roomId)
		const { index, name } = player

		if (!room) {
			console.log(`Room - ${roomId} not found`)
			return
		}

		const alreadyInGame = room.roomUsers.find(user => user.index === index)

		if (alreadyInGame) {
			return
		}

		room.roomUsers.push({ index, name })

		if (room.roomUsers.length === 2) {
			this.sendRoomUpdate(wss)
			gameManager.createGame(room, playerManager)
		}
	}

	getRoomById(roomId: string): Room | undefined {
		return this.rooms.get(roomId)
	}
}
