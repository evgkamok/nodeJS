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
	wins?: number
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

// GAMES TYPES
export interface Game {
	roomId: string
	playersInGame: PlayerInTheGame[]
	currentPlayer: string | null
}

type PlayerInTheGame = {
	indexPlayer: string
	ships: Ship[]
	ws: WebSocket
}

export interface AddShipData {
	gameId: string
	ships: Ship[]
	indexPlayer: string
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

// GAME ATTACK

export interface AttackData {
	gameId: string
	x: number
	y: number
	indexPlayer: string
}
