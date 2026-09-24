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

async function seedProjects() {
  loadEnv();

  const { default: connectToDatabase } = await import('../lib/mongodb');
  const { default: Project } = await import('../models/Project');
  const { ASHAPURA_PROJECTS } = await import('../lib/ashapura-data');

  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    console.log(`Checking existing projects in collection...`);
    const count = await Project.countDocuments();
    console.log(`Found ${count} existing projects.`);

    for (const p of ASHAPURA_PROJECTS) {
      const existing = await Project.findOne({ slug: p.id });
      if (!existing) {
        console.log(`Inserting project: ${p.name} (${p.id})...`);
        await Project.create({
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
      } else {
        console.log(`Project already exists: ${p.name}`);
      }
    }

    const finalCount = await Project.countDocuments();
    console.log(`\n✅ Projects seed completed successfully! Total in DB: ${finalCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding projects:', err);
    process.exit(1);
  }
}

seedProjects();
