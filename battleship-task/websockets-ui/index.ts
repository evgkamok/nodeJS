import { httpServer } from './src/http_server/index.js'
import { BattleShipServer } from './src/websocket-server.js'

const HTTP_PORT = 8181
const WS_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

new BattleShipServer(WS_PORT)
