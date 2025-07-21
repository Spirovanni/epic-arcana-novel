import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { characters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    console.log('Upload attempt for slug:', slug);
    console.log('File received:', file ? {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2)
    } : 'No file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('File type rejected:', file.type, 'Allowed types:', ALLOWED_TYPES);
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Please upload JPG, PNG, or WebP images only.` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File size rejected:', file.size, 'Max allowed:', MAX_FILE_SIZE);
      return NextResponse.json({ 
        error: `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please upload images smaller than 5MB.` 
      }, { status: 400 });
    }

    // Check if character exists
    const characterResult = await db
      .select({ id: characters.id, name: characters.name })
      .from(characters)
      .where(eq(characters.slug, slug))
      .limit(1);

    if (characterResult.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Create filename with character slug and timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${slug}-${timestamp}.${fileExtension}`;
    
    // Create the file path
    const publicPath = join(process.cwd(), 'public', 'images', 'characters', fileName);
    const urlPath = `/images/characters/${fileName}`;

    // Convert file to buffer and save
    console.log('Saving file to:', publicPath);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(publicPath, buffer);
    console.log('File saved successfully');

    // Update character record with new image URL
    console.log('Updating character with imageUrl:', urlPath);
    try {
      const updatedCharacter = await db
        .update(characters)
        .set({ 
          imageUrl: urlPath,
          updatedAt: new Date()
        })
        .where(eq(characters.slug, slug))
        .returning({
          id: characters.id,
          name: characters.name,
          slug: characters.slug,
          imageUrl: characters.imageUrl,
          updatedAt: characters.updatedAt
        });

      console.log('Database update result:', updatedCharacter);

      if (!updatedCharacter || updatedCharacter.length === 0) {
        console.log('No character was updated - slug may not exist');
        return NextResponse.json({ 
          error: 'Character not found for update' 
        }, { status: 404 });
      }

      console.log('Upload completed successfully');
      return NextResponse.json({
        success: true,
        imageUrl: urlPath,
        fileName,
        character: updatedCharacter[0]
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to update character with image URL',
        details: String(dbError)
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error uploading character image:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: String(error)
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Get current character to find existing image
    const characterResult = await db
      .select({ imageUrl: characters.imageUrl })
      .from(characters)
      .where(eq(characters.slug, slug))
      .limit(1);

    if (characterResult.length === 0) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Remove image URL from database
    await db
      .update(characters)
      .set({ 
        imageUrl: null,
        updatedAt: new Date()
      })
      .where(eq(characters.slug, slug));

    // Note: We're not deleting the physical file to prevent issues if multiple characters share an image
    // or if the user wants to restore it later. This could be enhanced with a cleanup job.

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing character image:', error);
    return NextResponse.json({ 
      error: 'Failed to remove image',
      details: String(error)
    }, { status: 500 });
  }
}