"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const db_1 = require("./db");
const parseBody_1 = require("./utils/parseBody");
const validation_1 = require("./utils/validation");
const uuid_1 = require("uuid");
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
function sendError(res, statusCode, message) {
    sendJSON(res, statusCode, message);
}
async function router(req, res) {
    const { method, url } = req;
    const parseUrl = new URL(url || '', `http://${req.headers.host}`);
    const pathname = parseUrl.pathname;
    try {
        // GET - ALL USERS
        if (method === 'GET' && pathname === '/api/users') {
            const users = db_1.db.getAllUsers();
            sendJSON(res, 200, users);
            return;
        }
        // GET - USER BY ID
        if (method === 'GET' && pathname.startsWith('/api/users/')) {
            const userId = pathname.split('/')[3];
            const user = db_1.db.getUserById(userId);
            if (!user) {
                sendError(res, 404, 'User not found');
            }
            sendJSON(res, 200, user);
            return;
        }
        // POST - ADD USER
        if (method === 'POST' && pathname === '/api/users') {
            const body = await (0, parseBody_1.parseBody)(req);
            const validation = (0, validation_1.validateCreateUser)(body);
            if (!validation.valid) {
                sendError(res, 400, validation.error || 'Invalid user data');
                return;
            }
            const newUser = {
                id: (0, uuid_1.v4)(),
                username: body.username,
                age: body.age,
                hobbies: body.hobbies,
            };
            db_1.db.addUser(newUser);
            sendJSON(res, 201, newUser);
            return;
        }
        // PUT - UPDATE USER
        if (method === 'PUT' && pathname.startsWith('/api/users/')) {
            const userId = pathname.split('/')[3];
            const body = await (0, parseBody_1.parseBody)(req);
            const validation = (0, validation_1.validateUpdateUser)(body);
            if (!validation.valid) {
                sendError(res, 400, validation.error || 'Invalid user data');
                return;
            }
            const updateUser = db_1.db.updateUser(userId, body);
            if (!updateUser) {
                sendError(res, 404, 'User not found');
            }
            sendJSON(res, 200, updateUser);
            return;
        }
        // DELETE
        if (method === 'DELETE' && pathname.startsWith('/api/users/')) {
            const userId = pathname.split('/')[3];
            const deleted = db_1.db.deleteUser(userId);
            if (!deleted) {
                sendError(res, 404, 'User not found');
                return;
            }
            sendJSON(res, 204, null);
            return;
        }
        sendError(res, 404, 'Endpoint not found');
    }
    catch (error) {
        console.error('Server error:', error);
        sendError(res, 500, 'internal server error');
    }
}
