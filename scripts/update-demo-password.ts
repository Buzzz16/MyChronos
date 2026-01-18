import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function updateDemoPassword() {
  console.log('🔐 Updating demo user password...\n')
  
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10)
    
    const user = await prisma.user.update({
      where: { email: 'demo@mychronos.app' },
      data: { password: hashedPassword },
    })
    
    console.log('✅ Demo user password updated!')
    console.log(`   Email: demo@mychronos.app`)
    console.log(`   Password: demo123\n`)
    console.log('🎉 You can now login with these credentials!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateDemoPassword()
