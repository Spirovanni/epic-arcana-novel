import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const location = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    if (location.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: location[0]
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Extract fields that can be updated
    const updateFields: Partial<typeof locations.$inferInsert> = {};
    
    if (body.name) updateFields.name = body.name;
    if (body.description) updateFields.description = body.description;
    if (body.type) updateFields.type = body.type;
    if (body.affiliation) updateFields.affiliation = body.affiliation;
    if (body.notable_features) updateFields.notable_features = body.notable_features;
    if (body.lore) updateFields.lore = body.lore;
    if (body.linked_arcana) updateFields.linked_arcana = body.linked_arcana;
    if (body.other_names) updateFields.other_names = body.other_names;
    if (body.sensory_description) updateFields.sensory_description = body.sensory_description;
    if (body.location) updateFields.location = body.location;
    if (body.coordinates) updateFields.coordinates = body.coordinates;
    
    updateFields.updatedAt = new Date();

    const updatedLocation = await db
      .update(locations)
      .set(updateFields)
      .where(eq(locations.id, id))
      .returning();

    if (updatedLocation.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: updatedLocation[0]
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update location' },
      { status: 500 }
    );
  }
}