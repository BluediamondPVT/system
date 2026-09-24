import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { ASHAPURA_PROJECTS } from '@/lib/ashapura-data';

export async function GET() {
  return handleProjectsSeed();
}

export async function POST() {
  return handleProjectsSeed();
}

async function handleProjectsSeed() {
  try {
    await connectToDatabase();

    const results = [];

    for (const p of ASHAPURA_PROJECTS) {
      const existing = await Project.findOne({ slug: p.id });
      if (!existing) {
        const created = await Project.create({
          slug: p.id,
          name: p.name,
          tag: p.tag || 'Free-Sale',
          location: p.location,
          zone: p.zone,
          floorsAndWings: p.floorsAndWings,
          totalFloors: p.totalFloors,
          wings: p.wings,
          basePricePerSqft: p.basePricePerSqft,
          rehabMembers: p.rehabMembers || 0,
          freeSaleUnits: p.freeSaleUnits,
          reraNumber: p.reraNumber,
          status: p.status,
          description: p.description,
          isActive: true,
        });
        results.push({ name: created.name, slug: created.slug, status: 'created' });
      } else {
        results.push({ name: existing.name, slug: existing.slug, status: 'already_exists' });
      }
    }

    const totalCount = await Project.countDocuments({ isActive: true });

    return NextResponse.json(
      {
        success: true,
        message: `Projects seeded successfully. Total projects in database: ${totalCount}`,
        totalCount,
        details: results,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error seeding projects:', error);
    const message = error instanceof Error ? error.message : 'Failed to seed projects';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
