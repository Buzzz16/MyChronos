import { prisma } from '../lib/prisma'

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!\n')
    
    // Count records
    const userCount = await prisma.user.count()
    const agendaCount = await prisma.agenda.count()
    const categoryCount = await prisma.category.count()
    
    console.log('📊 Database Statistics:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Agendas: ${agendaCount}`)
    console.log(`   Categories: ${categoryCount}\n`)
    
    if (categoryCount === 0) {
      console.log('💡 Tip: Run "npm run db:seed" to populate sample data\n')
    }
    
    console.log('🎉 Phase 1 setup verified successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check your .env file has correct DATABASE_URL')
    console.log('   2. Ensure you ran "npx prisma db push"')
    console.log('   3. Verify your Supabase project is active\n')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
