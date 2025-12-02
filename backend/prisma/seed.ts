import { PrismaClient, UserType } from "../src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "nelson@icomp.com"
  const adminPassword = "password123"
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      userType: UserType.ADMIN,
    },
  })

  console.log(`Admin user created: ${admin.email}`)

  console.log("Seeding products...")
  for (let i = 1; i <= 15; i++) {
    const productName = `Product ${i} - ${Math.random().toString(36).substring(7)}`
    const productPrice = parseFloat((Math.random() * 100 + 10).toFixed(2))
    const productStock = Math.floor(Math.random() * 100) + 1

    const existingProduct = await prisma.product.findFirst({
      where: { name: productName },
    })

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: productName,
          price: productPrice,
          stock: productStock,
        },
      })
    }
  }
  console.log("15 products seeded.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
