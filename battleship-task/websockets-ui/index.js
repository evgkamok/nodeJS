import { httpServer } from './src/http_server/index.js'
import { createWebSocketServer } from './src/ws_server/index.js'

const HTTP_PORT = 8181
const WS_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

console.log(`Start webSocket server on the ws://localhost:${WS_PORT}`)
createWebSocketServer(WS_PORT)
