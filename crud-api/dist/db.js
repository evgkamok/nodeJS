"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
class Database {
    users = [];
    getAllUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    addUser(user) {
        this.users.push(user);
        return user;
    }
    updateUser(id, updates) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return null;
        this.users[index] = { ...this.users[index], ...updates };
        return this.users[index];
    }
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
}
exports.db = new Database();
