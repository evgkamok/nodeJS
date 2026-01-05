import Fastify from 'fastify'
import mercurius from 'mercurius'

const fastify = Fastify()

const schema = `
  type Query {
    hello(name: String!): String
    users: [User]
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
`

const users = [
	{ id: '1', name: 'Иван', email: 'ivan@test.ru' },
	{ id: '2', name: 'Мария', email: 'maria@test.ru' },
	{ id: '3', name: 'Петр', email: 'petr@test.ru' },
]

const resolvers = {
	Query: {
		hello: (_, { name }) => `Привет, ${name}!`,
		users: () => users,
	},
}

fastify.register(mercurius, {
	schema,
	resolvers,
	graphiql: true,
})

fastify.listen({ port: 3000 }, err => {
	if (err) throw err
	console.log('✅ Сервер с Mercurius: http://localhost:3000')
	console.log('🔍 GraphiQL: http://localhost:3000/graphiql')
})
