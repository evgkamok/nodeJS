import autocannon from 'autocannon'

const query = JSON.stringify({
	query: `
    query {
      hello(name: "Тест")
      users {
        id
        name
        email
      }
    }
  `,
})

console.log('🚀 Запуск нагрузочного теста...\n')

async function testServer(url, name) {
	console.log(`📊 Тестируем: ${name}`)

	const result = await autocannon({
		url,
		connections: 100,
		duration: 10,
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: query,
	})

	console.log(`\n✅ ${name}:`)
	console.log(`   Запросов: ${result.requests.total}`)
	console.log(`   Запросов/сек: ${result.requests.average}`)
	console.log(
		`   Пропускная способность: ${(
			result.throughput.average /
			1024 /
			1024
		).toFixed(2)} MB/s`
	)
	console.log(
		`   Latency (средняя): ${result.latency.mean.toFixed(2)} ms\n`
	)

	return result
}

async function runTests() {
	console.log('⚠️  Убедись, что оба сервера запущены!\n')
	console.log('Сначала запусти в разных терминалах:')
	console.log('  npm run with')
	console.log('  npm run without\n')

	await new Promise(resolve => setTimeout(resolve, 2000))

	const withMercurius = await testServer(
		'http://localhost:3000/graphql',
		'С Mercurius (порт 3000)'
	)

	await new Promise(resolve => setTimeout(resolve, 2000))

	const withoutMercurius = await testServer(
		'http://localhost:3001/graphql',
		'БЕЗ Mercurius (порт 3001)'
	)

	const diff =
		(withMercurius.requests.average / withoutMercurius.requests.average -
			1) *
		100
	console.log('📈 РЕЗУЛЬТАТ:')
	console.log(`   Mercurius быстрее на ${diff.toFixed(1)}%`)
}

runTests().catch(console.error)
