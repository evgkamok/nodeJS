import { WebSocketServer } from 'ws'
import { Room, User } from '../types/index.js'
import { randomUUID } from 'crypto'
import { StoreDb } from '../store/store.js'

export class RoomManager {
	private rooms: Map<string, Room> = new Map()

	createRoom(userRoomCreator: User) {
		const indexRoom = randomUUID().substring(0, 6)
		const { name, index, ws } = userRoomCreator

		const room: Room = {
			roomId: indexRoom,
			roomUsers: [{ index, name }],
		}

		this.rooms.set(indexRoom, room)

		console.log(
			`room - < ${indexRoom} >, has been created by player - < ${name} >`
		)
	}

	updateRoom(wss: WebSocketServer | undefined) {
		const roomsWithOnePlayer: Room[] = []

		if (!wss) return

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

			wss.clients.forEach(user => {
				if (user.readyState === 1) {
					user.send(JSON.stringify(updateMessage))
				}
			})
		}
	}

	addUserToRoom(indexRoom: string, user: User, DB: StoreDb) {
		const room = this.getRoomById(indexRoom)
		const { index, name } = user

		if (!room) {
			console.log(`❌ room not found`)
			return
		}

		const isPlayerExistInTheRoom = room.roomUsers.some(
			user => user.index === index
		)

		if (isPlayerExistInTheRoom) return

		room.roomUsers.push({ index, name })

		if (room.roomUsers.length === 2) {
			this.updateRoom(DB.wss)
			DB.gameManager.createGame(room, DB)
		}
	}

	getRoomById(roomId: string): Room | undefined {
		return this.rooms.get(roomId)
	}

	// closeRoom(roomId: string, wss: WebSocketServer) {
	// 	this.rooms.delete(roomId)
	// 	this.sendRoomUpdate(wss)
	// }
}
