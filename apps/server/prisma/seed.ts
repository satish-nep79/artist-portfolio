import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/util/password.util';
import profileSeedData from './data/profile-seed.json';

const prisma = new PrismaClient();

async function main() {
  await seedAdmin();
  await seedProfile();
}

async function seedAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst();

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists. Skipping seed.');
      return;
    }

    const email = process.env.ADMIN_EMAIL;
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!email || !rawPassword) {
      throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables.');
    }

    const hashedPassword = await hashPassword(rawPassword);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

    console.log(`✅ Default admin created: ${newAdmin.email}`);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error; // Re-throw to trigger process.exit in main().catch
  }
}

async function seedProfile() {
  try {
    const existingSiteConfig = await prisma.siteConfigs.findFirst();

    if (existingSiteConfig) {
      console.log('ℹ️ Profile data already exists. Skipping seed.');
      return;
    }

    await prisma.siteConfigs.create({
      data: profileSeedData,
    });

    console.log('✅ Profile data seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding profile data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });