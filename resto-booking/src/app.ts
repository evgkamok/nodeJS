import Fastify from 'fastify'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolvers } from './resolvers.js'
import mercurius from 'mercurius'

const fastify = Fastify({
	logger: true,
})

// Загружаем GraphQL схему из файла
const schema = readFileSync(
	join(process.cwd(), 'src/schema.graphql'),
	'utf-8'
)

// Подключаем Mercurius с JIT
fastify.register(mercurius, {
	schema,
	resolvers,
	graphiql: true,
	jit: 1,
})

fastify.get('/health', async () => {
	return { status: 'ok' }
})

const start = async () => {
	try {
		await fastify.listen({ port: 3000 })
		console.log('Server running on http://localhost:3000')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
