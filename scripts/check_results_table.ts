import 'dotenv/config'
import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function check() {
    try {
        console.log('Checking user_assessment_results table...')
        const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_assessment_results'
    `)

        if (result.rows.length === 0) {
            console.error('CRITICAL: user_assessment_results table DOES NOT EXIST!')
        } else {
            console.log('Table exists with columns:', result.rows.map(r => r.column_name))
        }
    } catch (error) {
        console.error('Check failed:', error)
    }
}

check()
