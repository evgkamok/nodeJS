import { IncomingMessage, ServerResponse } from 'http'
import { db } from './db'
import { parseBody } from './utils/parseBody'
import { validateCreateUser, validateUpdateUser } from './utils/validation'
import { User } from './types'
import { v4 as uuidv4 } from 'uuid'

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
		// GET - ALL USERS
		if (method === 'GET' && pathname === '/api/users') {
			const users = db.getAllUsers()
			sendJSON(res, 200, users)
			return
		}

		// GET - USER BY ID
		if (method === 'GET' && pathname.startsWith('/api/users/')) {
			const userId = pathname.split('/')[3]
			const user = db.getUserById(userId)

			if (!user) {
				sendError(res, 404, 'User not found')
			}

			sendJSON(res, 200, user)
			return
		}

		// POST - ADD USER
		if (method === 'POST' && pathname === '/api/users') {
			const body = await parseBody(req)

			const validation = validateCreateUser(body)

			if (!validation.valid) {
				sendError(res, 400, validation.error || 'Invalid user data')
				return
			}

			const newUser: User = {
				id: uuidv4(),
				username: body.username,
				age: body.age,
				hobbies: body.hobbies,
			}

			db.addUser(newUser)
			sendJSON(res, 201, newUser)
			return
		}

		// PUT - UPDATE USER
		if (method === 'PUT' && pathname.startsWith('/api/users/')) {
			const userId = pathname.split('/')[3]

			const body = await parseBody(req)

			const validation = validateUpdateUser(body)

			if (!validation.valid) {
				sendError(res, 400, validation.error || 'Invalid user data')
				return
			}

			const updateUser = db.updateUser(userId, body)

			if (!updateUser) {
				sendError(res, 404, 'User not found')
			}

			sendJSON(res, 200, updateUser)
			return
		}
	} catch (error) {}
}
