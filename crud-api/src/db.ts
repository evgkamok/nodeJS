import { User } from './types'

class Database {
	private users: User[] = []

	getAllUsers(): User[] {
		return this.users
	}

	getUserById(id: string): User | undefined {
		return this.users.find(user => user.id === id)
	}

	addUser(user: User) {
		this.users.push(user)
		return user
	}

	updateUser(id: string, updates: Partial<User>): User | null {
		const index = this.users.findIndex(user => user.id === id)
		if (index === -1) return null

		this.users[index] = { ...this.users[index], ...updates }
		return this.users[index]
	}

	deleteUser(id: string): boolean {
		const index = this.users.findIndex(user => user.id === id)
		if (index === -1) return false

		this.users.splice(index, 1)
		return true
	}
}

export const db = new Database()
