import { Player, Room, RoomInfo } from '../types/index.js'
import { randomUUID } from 'crypto'

export class RoomManager {
	private rooms: Map<string, Room> = new Map()

	createRoom(player: Player): Room {
		const roomId = randomUUID()

		const room: Room = {
			roomId,
			roomUsers: [player],
		}

		this.rooms.set(roomId, room)
		console.log(`Room ${roomId}, has been created by player - ${player.name}`)

		return room
	}

	getRoomsInfo(): RoomInfo[] {
		const roomsArray: RoomInfo[] = []

		for (const room of this.rooms.values()) {
			if (room.roomUsers.length === 1) {
				roomsArray.push({
					roomId: room.roomId,
					roomUsers: room.roomUsers.map(player => ({
						name: player.name,
						index: player.index,
					})),
				})
			}
		}

		console.log(`Find rooms count - ${roomsArray.length}`)

		return roomsArray
	}

	getRoomById(roomId: string): Room | undefined {
		return this.rooms.get(roomId)
	}

	addPlayerToRoom(roomId: string, player: Player): boolean {
		const room = this.rooms.get(roomId)

		if (!room) {
			console.log(`Room - ${roomId} not found`)
			return false
		}

		if (room.roomUsers.length >= 2) {
			console.log(`Room - ${roomId} fulled`)
			return false
		}

		const alreadyInRoom = room.roomUsers.some(u => u.index === player.index)
		if (alreadyInRoom) {
			console.log(`Player ${player.name} already in the room ${roomId}`)
			return true
		}

		room.roomUsers.push(player)
		console.log(`Player ${player.name} connect to the room - ${roomId}`)

		return true
	}
}
