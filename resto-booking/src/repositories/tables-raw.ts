import type { PostgresDb } from '@fastify/postgres'

export class TablesRepositoryRaw {
	constructor(private pg: PostgresDb) {}

	async findAll() {
		const result = await this.pg.query(`
				SELECT
					id,
					table_number as "tableNumber",
					capacity,
					status,
					created_at as "createAt"
				FROM tables
				ORDER BY table_number ASC
			`)

		return result.rows
	}

	// async findAvailable(date: Date, guestCount: number) {
	// 	const result = await this.pg.query(
	// 		`
	// 			SELECT
	// 				t.id,
	// 				t.table_number as "tableNumber",
	// 				t.capacity,
	// 				t.status,
	// 				t.created_at as "createAt"
	// 			FROM tables t
	// 			WHERE t.capacity >= $1
	// 				AND t.status = 'AVAILABLE'
	// 				AND NOT EXISTS (
	// 					SELECT 1
	// 					FROM reservations r
	// 					WHERE r.table_id = t.id
	// 						AND r.reservation_date = $2
	// 						AND r.status != 'CANCELLED'
	// 				)
	// 			ORDER BY t.capacity ASC, t.table_number ASC
	// 		`,
	// 		[guestCount, date]
	// 	)

	// 	return result.rows
	// }

	async findAvailable(date: Date, guestCount: number) {
		const query = `
      SELECT 
        t.id,
        t.table_number as "tableNumber",
        t.capacity,
        t.status,
        t.created_at as "createdAt"
      FROM tables t
      WHERE t.capacity >= $1
        AND t.status = 'AVAILABLE'
        AND NOT EXISTS (
          SELECT 1 
          FROM reservations r
          WHERE r.table_id = t.id
            AND r.reservation_date = $2
            AND r.status != 'CANCELLED'
        )
      ORDER BY t.capacity ASC, t.table_number ASC
    `

		// ← ДОБАВЬ ЛОГИРОВАНИЕ:
		console.log('🔍 Raw SQL Query:', query.trim())
		console.log('📊 Parameters:', [guestCount, date])

		const result = await this.pg.query(query, [guestCount, date])

		console.log('✅ Rows returned:', result.rows.length)

		return result.rows
	}
}
