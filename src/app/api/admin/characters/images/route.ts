import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { characters } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { getUserPermissions } from '@/lib/auth'

/**
 * GET /api/admin/characters/images
 * Get all characters with their current image status
 */
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const permissions = await getUserPermissions()
    if (!permissions.canWrite) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const allCharacters = await db.select({
      id: characters.id,
      slug: characters.slug,
      name: characters.name,
      imageUrl: characters.imageUrl,
    }).from(characters).orderBy(characters.name)

    return NextResponse.json(allCharacters)
  } catch (error) {
    console.error('Error fetching characters for image management:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/characters/images
 * Update character image URL
 */
export async function PATCH(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const permissions = await getUserPermissions()
    if (!permissions.canWrite) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { characterId, imageUrl } = await request.json()

    if (!characterId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: characterId, imageUrl' },
        { status: 400 }
      )
    }

    const result = await db
      .update(characters)
      .set({
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(characters.id, characterId))
      .returning({
        id: characters.id,
        slug: characters.slug,
        name: characters.name,
        imageUrl: characters.imageUrl,
      })

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating character image:', error)
    return NextResponse.json(
      { error: 'Failed to update character image' },
      { status: 500 }
    )
  }
}
