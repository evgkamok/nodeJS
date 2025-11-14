export interface WSMessage {
	id: number
	type: string
	data: any
}

export interface Player {
	name: string
	password: string
	index: number | string
	wins: number
	ws: any
}
