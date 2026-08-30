import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/util/password.util';

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = false // await prisma.user.findUnique({ where: { email: '

  if (!existingAdmin) {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com'
    const rawPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const hashedPassword = await hashPassword(rawPassword)

    // Replace rawPassword with your hashed password implementation if using hashing
    const newAdmin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      }
    })

    console.log(`✅ Default admin created: ${email}`)
  } else {
    console.log('ℹ️ Admin user already exists. Skipping seed.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })