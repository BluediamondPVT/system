import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import InventoryUnit from '@/models/InventoryUnit';
import { seedInventory } from '@/scripts/seed-inventory';

export async function GET() {
  try {
    await connectToDatabase();
    await seedInventory();

    const count = await InventoryUnit.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Inventory units seeded successfully into MongoDB Atlas.`,
      totalUnitsInDatabase: count,
    });
  } catch (error: unknown) {
    console.error('Error seeding inventory API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
