import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    await connectToDatabase();

    // Check if any SUPER_ADMIN already exists
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });

    if (existingSuperAdmin) {
      return NextResponse.json(
        {
          success: true,
          message: 'A Super Admin already exists in the database. Seeding skipped.',
          superAdminExists: true,
          admin: {
            id: existingSuperAdmin._id,
            email: existingSuperAdmin.email,
            username: existingSuperAdmin.username,
            role: existingSuperAdmin.role,
            createdAt: existingSuperAdmin.createdAt,
          },
        },
        { status: 200 }
      );
    }

    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@erp.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';

    // Create default SUPER_ADMIN user
    const superAdmin = new User({
      email: defaultEmail,
      username: defaultUsername,
      password: defaultPassword, // Will be hashed by pre-save hook
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    await superAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Default Super Admin created successfully.',
        superAdminExists: true,
        created: true,
        admin: {
          id: superAdmin._id,
          email: superAdmin.email,
          username: superAdmin.username,
          role: superAdmin.role,
          createdAt: superAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
