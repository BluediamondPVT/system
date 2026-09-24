import fs from 'fs';
import path from 'path';
import connectToDatabase from '../lib/mongodb';
import InventoryUnit from '../models/InventoryUnit';

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

loadEnv();

interface SimpleUnit {
  projectSlug: string;
  wing: string;
  floor: number;
  unitNumber: string;
  typology: '1BHK' | '2BHK' | '3BHK';
  carpetAreaSqft: number;
  basePricePerSqft: number;
  status: 'Available' | 'Hold' | 'Booked' | 'JV';
  tokenHolder?: string | null;
  tokenDate?: string | null;
  tokenAmount?: number | null;
  tokenPhone?: string | null;
}

// Exactly 20 clean sample units across all sites (2 to 3 units per site)
const SAMPLE_20_UNITS: SimpleUnit[] = [
  // 1. Meghmala Crysta (3 units)
  {
    projectSlug: 'meghmala-crysta',
    wing: 'Wing A',
    floor: 1,
    unitNumber: '101',
    typology: '1BHK',
    carpetAreaSqft: 485,
    basePricePerSqft: 23500,
    status: 'Available',
  },
  {
    projectSlug: 'meghmala-crysta',
    wing: 'Wing A',
    floor: 2,
    unitNumber: '201',
    typology: '2BHK',
    carpetAreaSqft: 740,
    basePricePerSqft: 23500,
    status: 'Hold',
    tokenHolder: 'Rahul Verma',
    tokenDate: 'Today, 24/09/2026',
    tokenAmount: 100000,
    tokenPhone: '+91 98201 12345',
  },
  {
    projectSlug: 'meghmala-crysta',
    wing: 'Wing A',
    floor: 3,
    unitNumber: '301',
    typology: '3BHK',
    carpetAreaSqft: 1080,
    basePricePerSqft: 23500,
    status: 'Booked',
  },

  // 2. Amar CHSL (3 units)
  {
    projectSlug: 'amar-chsl',
    wing: 'Tower 1',
    floor: 1,
    unitNumber: '101',
    typology: '1BHK',
    carpetAreaSqft: 450,
    basePricePerSqft: 21500,
    status: 'JV', // Society Rehab Member
  },
  {
    projectSlug: 'amar-chsl',
    wing: 'Tower 1',
    floor: 2,
    unitNumber: '201',
    typology: '2BHK',
    carpetAreaSqft: 720,
    basePricePerSqft: 21500,
    status: 'Available',
  },
  {
    projectSlug: 'amar-chsl',
    wing: 'Tower 1',
    floor: 3,
    unitNumber: '301',
    typology: '2BHK',
    carpetAreaSqft: 720,
    basePricePerSqft: 21500,
    status: 'Hold',
    tokenHolder: 'Sneha Patil',
    tokenDate: 'Today, 24/09/2026',
    tokenAmount: 150000,
    tokenPhone: '+91 98920 44556',
  },

  // 3. Navkar Heritage (3 units)
  {
    projectSlug: 'navkar-heritage',
    wing: 'Wing A',
    floor: 1,
    unitNumber: '101',
    typology: '2BHK',
    carpetAreaSqft: 710,
    basePricePerSqft: 22000,
    status: 'Available',
  },
  {
    projectSlug: 'navkar-heritage',
    wing: 'Wing A',
    floor: 2,
    unitNumber: '201',
    typology: '2BHK',
    carpetAreaSqft: 710,
    basePricePerSqft: 22000,
    status: 'Booked',
  },
  {
    projectSlug: 'navkar-heritage',
    wing: 'Wing A',
    floor: 3,
    unitNumber: '301',
    typology: '3BHK',
    carpetAreaSqft: 1050,
    basePricePerSqft: 22000,
    status: 'Available',
  },

  // 4. Bhagywan Primrose (2 units)
  {
    projectSlug: 'bhagywan-primrose',
    wing: 'Wing A',
    floor: 1,
    unitNumber: '101',
    typology: '1BHK',
    carpetAreaSqft: 420,
    basePricePerSqft: 16500,
    status: 'Available',
  },
  {
    projectSlug: 'bhagywan-primrose',
    wing: 'Wing A',
    floor: 2,
    unitNumber: '201',
    typology: '2BHK',
    carpetAreaSqft: 650,
    basePricePerSqft: 16500,
    status: 'Hold',
    tokenHolder: 'Priya Sharma',
    tokenDate: 'Today, 24/09/2026',
    tokenAmount: 100000,
    tokenPhone: '+91 97690 12890',
  },

  // 5. Aloha Township (2 units)
  {
    projectSlug: 'aloha-township',
    wing: 'Cluster 1',
    floor: 1,
    unitNumber: '101',
    typology: '1BHK',
    carpetAreaSqft: 410,
    basePricePerSqft: 4800,
    status: 'Available',
  },
  {
    projectSlug: 'aloha-township',
    wing: 'Cluster 1',
    floor: 2,
    unitNumber: '201',
    typology: '2BHK',
    carpetAreaSqft: 620,
    basePricePerSqft: 4800,
    status: 'Available',
  },

  // 6. Ronak Villa (2 units)
  {
    projectSlug: 'ronak-villa',
    wing: 'Tower 1',
    floor: 1,
    unitNumber: '101',
    typology: '2BHK',
    carpetAreaSqft: 750,
    basePricePerSqft: 24000,
    status: 'Available',
  },
  {
    projectSlug: 'ronak-villa',
    wing: 'Tower 1',
    floor: 2,
    unitNumber: '201',
    typology: '3BHK',
    carpetAreaSqft: 1100,
    basePricePerSqft: 24000,
    status: 'Booked',
  },

  // 7. Jay Gagan (2 units)
  {
    projectSlug: 'jay-gagan',
    wing: 'Main Wing',
    floor: 1,
    unitNumber: '101',
    typology: '2BHK',
    carpetAreaSqft: 850,
    basePricePerSqft: 25500,
    status: 'Available',
  },
  {
    projectSlug: 'jay-gagan',
    wing: 'Main Wing',
    floor: 2,
    unitNumber: '201',
    typology: '3BHK',
    carpetAreaSqft: 1250,
    basePricePerSqft: 25500,
    status: 'Available',
  },

  // 8. Nishad CHSL (2 units)
  {
    projectSlug: 'nishad-chsl',
    wing: 'Signature Wing',
    floor: 1,
    unitNumber: '101',
    typology: '3BHK',
    carpetAreaSqft: 1400,
    basePricePerSqft: 38000,
    status: 'Available',
  },
  {
    projectSlug: 'nishad-chsl',
    wing: 'Signature Wing',
    floor: 2,
    unitNumber: '201',
    typology: '3BHK',
    carpetAreaSqft: 1400,
    basePricePerSqft: 38000,
    status: 'Hold',
    tokenHolder: 'Vikram Merchant',
    tokenDate: 'Today, 24/09/2026',
    tokenAmount: 200000,
    tokenPhone: '+91 98200 99988',
  },

  // 9. Diyana Villa (1 unit)
  {
    projectSlug: 'diyana-villa',
    wing: 'Tower 1',
    floor: 1,
    unitNumber: '101',
    typology: '2BHK',
    carpetAreaSqft: 760,
    basePricePerSqft: 23800,
    status: 'Available',
  },
];

export async function seedInventory() {
  console.log('Connecting to MongoDB Atlas to reset inventory to exactly 20 sample units...');
  await connectToDatabase();

  // 1. Wipe out previous bulk units to keep MongoDB Atlas clean
  const deleteResult = await InventoryUnit.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} old units from MongoDB Atlas.`);

  // 2. Insert clean 20 sample units
  const inserted = await InventoryUnit.insertMany(
    SAMPLE_20_UNITS.map((u) => ({
      ...u,
      tokenHolder: u.tokenHolder || null,
      tokenDate: u.tokenDate || null,
      tokenAmount: u.tokenAmount || null,
      tokenPhone: u.tokenPhone || null,
      heldBy: u.status === 'Hold' ? 'admin@erp.com' : null,
    }))
  );

  console.log(`\n========================================`);
  console.log(`SUCCESS: Seeded exactly ${inserted.length} clean sample units in MongoDB Atlas!`);
  console.log(`Each project has only 2-3 flats, perfectly organized!`);
  console.log(`========================================\n`);
}

// Allow direct CLI invocation
if (require.main === module) {
  seedInventory()
    .then(() => {
      console.log('Reset complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error during inventory reset:', err);
      process.exit(1);
    });
}
