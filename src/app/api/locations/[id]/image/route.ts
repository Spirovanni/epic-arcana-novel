import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { locations } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('API endpoint hit for location image upload');
    
    // Validate params
    if (!params) {
      console.error('No params provided');
      return NextResponse.json({ error: 'No location ID provided' }, { status: 400 });
    }
    
    const { id } = await params;
    console.log('Location ID from params:', id);
    
    if (!id) {
      console.error('Location ID is empty');
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }
    
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    console.log('Upload attempt for location ID:', id);
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

    // Check if location exists
    console.log('Checking if location exists with ID:', id);
    let locationResult;
    try {
      locationResult = await db
        .select({ id: locations.id, name: locations.name })
        .from(locations)
        .where(eq(locations.id, id))
        .limit(1);
      console.log('Location query result:', locationResult);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json({ 
        error: 'Database error while checking location',
        details: String(dbError)
      }, { status: 500 });
    }

    if (locationResult.length === 0) {
      console.log('Location not found for ID:', id);
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    // Create slug from location name for filename
    const locationName = locationResult[0].name;
    const slug = locationName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    // Create filename with location slug and timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${slug}-${timestamp}.${fileExtension}`;
    
    // Create the file path
    const publicPath = join(process.cwd(), 'public', 'images', 'locations', fileName);
    const urlPath = `/images/locations/${fileName}`;

    // Convert file to buffer and save
    console.log('Saving file to:', publicPath);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(publicPath, buffer);
    console.log('File saved successfully');

    // Update location record with new image URL
    console.log('Updating location with image_url:', urlPath);
    try {
      const updatedLocation = await db
        .update(locations)
        .set({ 
          image_url: urlPath,
          updatedAt: new Date()
        })
        .where(eq(locations.id, id))
        .returning({
          id: locations.id,
          name: locations.name,
          image_url: locations.image_url,
          updatedAt: locations.updatedAt
        });

      console.log('Database update result:', updatedLocation);

      if (!updatedLocation || updatedLocation.length === 0) {
        console.log('No location was updated - ID may not exist');
        return NextResponse.json({ 
          error: 'Location not found for update' 
        }, { status: 404 });
      }

      console.log('Upload completed successfully');
      return NextResponse.json({
        success: true,
        imageUrl: urlPath,
        fileName,
        location: updatedLocation[0]
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to update location with image URL',
        details: String(dbError)
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error uploading location image:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: String(error)
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get current location to find existing image
    const locationResult = await db
      .select({ image_url: locations.image_url })
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    if (locationResult.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    // Remove image URL from database
    await db
      .update(locations)
      .set({ 
        image_url: null,
        updatedAt: new Date()
      })
      .where(eq(locations.id, id));

    // Note: We're not deleting the physical file to prevent issues if multiple locations share an image
    // or if the user wants to restore it later. This could be enhanced with a cleanup job.

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing location image:', error);
    return NextResponse.json({ 
      error: 'Failed to remove image',
      details: String(error)
    }, { status: 500 });
  }
}