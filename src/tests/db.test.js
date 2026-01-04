const prisma = require('../config/prisma')

async function testDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDB()
