import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create default categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'default-work' },
      update: {},
      create: {
        id: 'default-work',
        name: 'Work',
        description: 'Professional and work-related tasks',
        color: '#3B82F6', // Blue
        icon: 'briefcase',
      },
    }),
    prisma.category.upsert({
      where: { id: 'default-personal' },
      update: {},
      create: {
        id: 'default-personal',
        name: 'Personal',
        description: 'Personal tasks and errands',
        color: '#10B981', // Green
        icon: 'user',
      },
    }),
    prisma.category.upsert({
      where: { id: 'default-health' },
      update: {},
      create: {
        id: 'default-health',
        name: 'Health & Fitness',
        description: 'Health, exercise, and wellness',
        color: '#EF4444', // Red
        icon: 'heart',
      },
    }),
    prisma.category.upsert({
      where: { id: 'default-learning' },
      update: {},
      create: {
        id: 'default-learning',
        name: 'Learning',
        description: 'Education and skill development',
        color: '#8B5CF6', // Purple
        icon: 'book',
      },
    }),
    prisma.category.upsert({
      where: { id: 'default-social' },
      update: {},
      create: {
        id: 'default-social',
        name: 'Social',
        description: 'Social events and meetups',
        color: '#F59E0B', // Amber
        icon: 'users',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create a demo user (optional - for testing)
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mychronos.app' },
    update: { password: hashedPassword },
    create: {
      email: 'demo@mychronos.app',
      password: hashedPassword,
      name: 'Demo User',
      timezone: 'Asia/Jakarta',
      city: 'Jakarta',
      region: 'Jakarta',
      country: 'Indonesia',
      displayMode: 'DETAILED',
      notificationsEnabled: true,
    },
  })

  console.log(`✅ Created demo user: ${demoUser.email}`)

  // Create sample agendas for demo user
  const sampleAgendas = await Promise.all([
    prisma.agenda.create({
      data: {
        userId: demoUser.id,
        title: 'Team Meeting',
        description: 'Weekly sync with the development team',
        targetDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        categoryId: 'default-work',
        priority: 'HIGH',
      },
    }),
    prisma.agenda.create({
      data: {
        userId: demoUser.id,
        title: 'Morning Workout',
        description: '30-minute cardio session',
        targetDateTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        categoryId: 'default-health',
        priority: 'MEDIUM',
      },
    }),
    prisma.agenda.create({
      data: {
        userId: demoUser.id,
        title: 'Complete TypeScript Course',
        description: 'Finish the advanced TypeScript module',
        targetDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        categoryId: 'default-learning',
        priority: 'LOW',
      },
    }),
  ])

  console.log(`✅ Created ${sampleAgendas.length} sample agendas`)
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
