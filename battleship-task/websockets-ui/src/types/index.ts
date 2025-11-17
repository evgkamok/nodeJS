import { WebSocket } from 'ws'

export interface ClientMessage {
	type: string
	data: string
	id: number
}

export interface RegistrationData {
	name: string
	password: string
}

export interface Player {
	name: string
	password: string
	index: number
	ws: WebSocket
}

// ROOM TYPES

export interface Room {
	roomId: string
	roomUsers: Player[]
}

export interface RoomInfo {
	roomId: string
	roomUsers: Array<{
		name: string
		index: number
	}>
}
