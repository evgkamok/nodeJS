import { IncomingMessage, ServerResponse } from 'http'
import { db } from './db'
import { parseBody } from './utils/parseBody'

function sendJSON(res: ServerResponse, statusCode: number, data: any) {
	res.writeHead(statusCode, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify(data))
}

function sendError(res: ServerResponse, statusCode: number, message: string) {
	sendJSON(res, statusCode, message)
}

export async function router(req: IncomingMessage, res: ServerResponse) {
	const { method, url } = req

	const parseUrl = new URL(url || '', `http://${req.headers.host}`)
	const pathname = parseUrl.pathname

	try {
		// GET - ALL USERS - /api/users
		if (method === 'GET' && pathname === '/api/users') {
			const users = db.getAllUsers()
			sendJSON(res, 200, users)
			return
		}

		// GET - USER BY ID - /api/users/{userId}
		if (method === 'GET' && pathname.startsWith('/api/users/')) {
			const userId = pathname.split('/')[3]
			const user = db.getUserById(userId)

			if (!user) {
				sendError(res, 404, 'User not found')
			}

			sendJSON(res, 200, user)
			return
		}

		// POST - ADD USER - /api/users
		if (method === 'POST' && pathname === '/api/users') {
			const body = await parseBody(req)
		}
	} catch (error) {}
}
