import { PrismaClient } from '@prisma/client'
// Import your password hashing function if applicable
// import { hashPassword } from '../src/utils/crypto'

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = false // await prisma.user.findUnique({ where: { email: '

  if (!existingAdmin) {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com'
    const rawPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    console.log(`ℹ️ Creating default admin user with email: ${email}`)
    console.log(`ℹ️ Using default password: ${rawPassword}`)

    // Replace rawPassword with your hashed password implementation if using hashing
    const newAdmin = await prisma.user.create({
      data: {
        email,
        passwordHash: rawPassword,
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