import { WebSocketServer, WebSocket } from 'ws'
import { WSMessage } from './types'
import { PlayerManager } from './player-manager'

export class BattleShipServer {
	private wss: WebSocketServer
	private playerManager: PlayerManager
	// private gameManager

	constructor(port: number) {
		this.wss = new WebSocketServer({ port })
		this.playerManager = new PlayerManager()

		console.log(`Start webSocket server on the ws://localhost:${port}`)

		this.wss.on('connection', this.handleConnection.bind(this))
	}

	private handleConnection(ws: WebSocket) {
		console.log('New client connected')

		ws.on('message', message => {
			try {
				const data = JSON.parse(message.toString())
				console.log('Received command: ', data.type)

				this.handleMessage(ws, data)
			} catch (error) {
				console.error('Error: ', error)
			}
		})

		ws.on('close', () => {
			console.log('Client disconnect')
		})
	}

	private handleMessage(ws: WebSocket, message: WSMessage) {
		switch (message.type) {
			case 'reg':
				this.handleRegistration(ws, message)
				break
			default:
				console.log('Unknown command: ', message.type)
		}
	}

	private handleRegistration(ws: WebSocket, message: WSMessage) {
		console.log('=== REGISTRATION START ===')
		console.log('Received message:', message)
		const { name, password } = JSON.parse(message.data)
		const response = this.playerManager.register(name, password, ws)
		console.log('Response from playerManager:', response)

		ws.send(JSON.stringify(response))
	}
}
