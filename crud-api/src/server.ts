import * as http from 'http'
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 4000

const server = http.createServer()

server.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

server.on('error', (error: NodeJS.ErrnoException) => {
	if (error.code === 'EADDRINUSE') {
		console.error(`❌ Port ${PORT} is already in use`)
	} else {
		console.error('❌ Server error:', error)
	}
	process.exit(1)
})

process.on('SIGINT', () => {
	server.close(() => {
		console.log('✅ Server closed')
		process.exit(0)
	})
})
