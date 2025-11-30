import { NextResponse } from 'next/server'
import { readdirSync } from 'fs'
import { join } from 'path'
import { currentUser } from '@clerk/nextjs/server'
import { getUserPermissions } from '@/lib/auth'

/**
 * GET /api/admin/characters/available-images
 * List all available character images in the public/images/characters folder
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

    // Read the public/images/characters folder
    const publicPath = join(process.cwd(), 'public', 'images', 'characters')

    try {
      const files = readdirSync(publicPath)

      // Filter for image files and sort them
      const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort()

      return NextResponse.json(imageFiles)
    } catch (fsError) {
      console.error('Error reading images directory:', fsError)
      return NextResponse.json(
        { error: 'Failed to read images directory' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error listing available images:', error)
    return NextResponse.json(
      { error: 'Failed to list available images' },
      { status: 500 }
    )
  }
}
