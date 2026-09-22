import fs from 'fs';
import path from 'path';

// Self-contained environment loader for .env.local
function loadEnv() {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  const envDefaultPath = path.resolve(process.cwd(), '.env');

  const fileToLoad = fs.existsSync(envLocalPath)
    ? envLocalPath
    : fs.existsSync(envDefaultPath)
    ? envDefaultPath
    : null;

  if (fileToLoad) {
    const content = fs.readFileSync(fileToLoad, 'utf8');
    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || !line.includes('=')) continue;

      const equalIndex = line.indexOf('=');
      const key = line.slice(0, equalIndex).trim();
      let value = line.slice(equalIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

async function seed() {
  // Ensure env is loaded before importing db modules
  loadEnv();

  const { default: connectToDatabase } = await import('../lib/mongodb');
  const { default: User } = await import('../models/User');

  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully.');

    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });

    if (existingSuperAdmin) {
      console.log('Super Admin already exists:');
      console.log(`- ID: ${existingSuperAdmin._id}`);
      console.log(`- Email: ${existingSuperAdmin.email}`);
      console.log(`- Username: ${existingSuperAdmin.username}`);
      console.log(`- Role: ${existingSuperAdmin.role}`);
      console.log('Seeding skipped (idempotent).');
      process.exit(0);
    }

    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@erp.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';

    console.log(`Creating default Super Admin user (${defaultEmail})...`);

    const superAdmin = new User({
      email: defaultEmail,
      username: defaultUsername,
      password: defaultPassword, // Pre-save hook will hash this
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    await superAdmin.save();

    console.log('Default Super Admin created successfully!');
    console.log({
      id: superAdmin._id.toString(),
      email: superAdmin.email,
      username: superAdmin.username,
      role: superAdmin.role,
      createdAt: superAdmin.createdAt,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
