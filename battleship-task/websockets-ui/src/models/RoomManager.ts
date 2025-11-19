import { WebSocketServer } from 'ws'
import { Player, Room, RoomInfo } from '../types/index.js'
import { ServerContext } from '../ServerContext.js'
import { randomUUID } from 'crypto'

export class RoomManager {
	private rooms: Map<string, Room> = new Map()

	createRoom(playerRoomCreator: Player, context: ServerContext) {
		const roomId = randomUUID().substring(0, 6)

		const room: Room = {
			roomId,
			roomUsers: [playerRoomCreator],
		}

		this.rooms.set(roomId, room)

		this.sendRoomUpdate(context.wss)

		console.log(
			`Room ${roomId}, has been created by player - ${playerRoomCreator.name}`
		)
	}

	sendRoomUpdate(wss: WebSocketServer): void {
		const roomsWithOnePlayer: RoomInfo[] = []

		for (const room of this.rooms.values()) {
			if (room.roomUsers.length === 1) {
				roomsWithOnePlayer.push({
					roomId: room.roomId,
					roomUsers: [...room.roomUsers],
				})
			}
		}

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

	addPlayerToRoom(roomId: string, player: Player): boolean {
		const room = this.getRoomById(roomId)

		if (!room) {
			console.log(`Room - ${roomId} not found`)
			return false
		}

		room.roomUsers.push(player)

		return true
	}

	getRoomById(roomId: string): Room | undefined {
		return this.rooms.get(roomId)
	}
}
