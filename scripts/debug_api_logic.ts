import 'dotenv/config'
import { db } from '../src/lib/db'
import { users, assessments, assessmentStatusEnum } from '../src/lib/schema'
import { eq, desc, and } from 'drizzle-orm'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function run() {
    try {
        console.log('--- Debugging Assessment Logic ---')

        // 1. Fetch User
        console.log('1. Fetching user...')
        const [user] = await db.select().from(users).limit(1)
        if (!user) {
            console.error('No users found in DB!')
            return
        }
        console.log('User found:', user.id, user.email)

        // 2. Simulate GET /progress logic
        console.log('2. Simulating GET /progress query...')
        const [latest] = await db.select()
            .from(assessments)
            .where(eq(assessments.userId, user.id))
            .orderBy(desc(assessments.updatedAt))
            .limit(1)
        console.log('Latest assessment:', latest)

        // 3. Simulate ensureAssessment logic (from POST)
        console.log('3. Simulating ensureAssessment...')
        const [inProgress] = await db.select().from(assessments)
            .where(and(
                eq(assessments.userId, user.id),
                eq(assessments.status, 'in_progress')
            ))
            .limit(1)

        if (inProgress) {
            console.log('Found in-progress assessment:', inProgress.id)
        } else {
            console.log('Creating new assessment...')
            const [created] = await db.insert(assessments).values({
                userId: user.id,
                status: 'in_progress',
                currentQuestionIndex: 0,
                totalQuestions: 54 // Hardcoded for test
            }).returning()
            console.log('Created assessment:', created)
        }

    } catch (error) {
        console.error('CRASH:', error)
    }
}

run().catch(console.error)
