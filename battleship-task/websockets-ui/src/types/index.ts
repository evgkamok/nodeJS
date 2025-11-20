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
	roomUsers: Array<{
		name: string
		index: number
	}>
}

// SHIPS TYPES
export interface Ship {
	position: {
		x: number
		y: number
	}
	direction: boolean
	length: number
	type: 'small' | 'medium ' | 'large' | 'huge'
}

export interface AddShipData {
	gameId: string
	ships: Ship[]
	indexPlayer: number
}

// GAME ATTACK

export interface AttackData {
	x: number
	y: number
	gameId: string
	indexPlayer: number
}
