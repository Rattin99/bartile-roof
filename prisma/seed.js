import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Profiles
  const profiles = [
    { name: 'Legendary Slate', sort_order: 10 },
    { name: 'New England Slate', sort_order: 20 },
    { name: 'Legendary Split Timber', sort_order: 30 },
    { name: 'Split Timber', sort_order: 40 },
    { name: 'Sierra Mission', sort_order: 50 },
    { name: 'European', sort_order: 60 },
    { name: 'Yorkshire Slate', sort_order: 70 },
    { name: 'Yorkshire Split Timber', sort_order: 80 },
  ];

  for (const p of profiles) {
    await prisma.tileProfile.create({ data: p });
  }

  // Colors
  const colors = [
    { name: 'Charcoal', hex_code: '#36454F', sort_order: 10 },
    { name: 'Terra Cotta', hex_code: '#E2725B', sort_order: 20 },
    { name: 'Slate Grey', hex_code: '#708090', sort_order: 30 },
    { name: 'Classic Red', hex_code: '#8B0000', sort_order: 40 },
    { name: 'Brown', hex_code: '#964B00', sort_order: 50 },
    { name: 'Tan', hex_code: '#D2B48C', sort_order: 60 },
    { name: 'Cream', hex_code: '#FFFDD0', sort_order: 70 },
    { name: 'Green', hex_code: '#006400', sort_order: 80 },
  ];

  for (const c of colors) {
    await prisma.tileColor.create({ data: c });
  }

  // Textures
  const textures = [
    { name: 'Smooth/Standard', sort_order: 10 },
    { name: 'Straight Brush', sort_order: 20 },
    { name: 'Swirl Brush', sort_order: 30 },
    { name: 'Cobble', sort_order: 40 },
    { name: 'Vintage', sort_order: 50 },
  ];

  for (const t of textures) {
    await prisma.tileTexture.create({ data: t });
  }

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
