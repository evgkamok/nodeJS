import Fastify from 'fastify'
import { graphql, buildSchema } from 'graphql'

const fastify = Fastify()

const schema = buildSchema(`
  type Query {
    hello(name: String!): String
    users: [User]
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
`)

const users = [
	{ id: '1', name: 'Иван', email: 'ivan@test.ru' },
	{ id: '2', name: 'Мария', email: 'maria@test.ru' },
	{ id: '3', name: 'Петр', email: 'petr@test.ru' },
]

const root = {
	hello: ({ name }) => `Привет, ${name}!`,
	users: () => users,
}

fastify.post('/graphql', async (req, reply) => {
	const { query, variables } = req.body

	const result = await graphql({
		schema,
		source: query,
		rootValue: root,
		variableValues: variables,
	})

	return result
})

fastify.get('/', async (req, reply) => {
	return {
		message: 'GraphQL без Mercurius',
		endpoint: 'POST /graphql',
	}
})

fastify.listen({ port: 3001 }, err => {
	if (err) throw err
	console.log('✅ Сервер БЕЗ Mercurius: http://localhost:3001')
	console.log('📮 Endpoint: POST http://localhost:3001/graphql')
})
