import Fastify from 'fastify'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolvers } from './resolvers.js'
import mercurius from 'mercurius'
import depthLimit from 'graphql-depth-limit'
import postgres from '@fastify/postgres'

const ENABLE_GRAPHIQL = process.env.GRAPHQL_ENABLE_GRAPHIQL === 'true'
const GRAPHQL_DEPTH_LIMIT = parseInt(
	process.env.GRAPHQL_DEPTH_LIMIT || '5',
)

const fastify = Fastify({
	logger: true,
})

// Подключаем PostgreSQL для raw SQL запросов
fastify.register(postgres, {
	connectionString: process.env.DATABASE_URL,
})

// Загружаем GraphQL схему из файла
const schema = readFileSync(
	join(process.cwd(), 'src/schema.graphql'),
	'utf-8',
)

// Подключаем Mercurius с JIT
fastify.register(mercurius, {
	schema,
	resolvers,
	graphiql: ENABLE_GRAPHIQL,
	jit: 1,
	validationRules: [depthLimit(GRAPHQL_DEPTH_LIMIT)],
	context: async (request, reply) => {
		return {
			request,
			reply,
			pg: fastify.pg,
		}
	},
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
