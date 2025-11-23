import { WebSocket } from 'ws'

export type Message = {
	type: string
	data: string
	id: number
}

// USER TYPES
export type UserRegisterRequest = {
	name: string
	password: string
}

export type User = {
	index: string
	name: string
	password: string
	ws: WebSocket
}

// ROOM TYPES
export interface Room {
	roomId: string
	roomUsers: Array<{
		name: string
		index: string
	}>
}

export interface Player {
	name: string
	password: string
	index: number
	ws: WebSocket
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
	hits?: Set<string>
}

export interface AddShipData {
	gameId: string
	ships: Ship[]
	indexPlayer: number
}

// GAME ATTACK
export interface PlayerInGame {
	indexPlayer: number
	ships: Ship[]
	ws: WebSocket
}

export interface Game {
	gameId: string
	roomId: string
	players: PlayerInGame[]
	currentPlayer: number
}

export interface AttackData {
	gameId: string
	x: number
	y: number
	indexPlayer: number
}
