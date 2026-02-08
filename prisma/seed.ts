import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pmportal.com' },
    update: {},
    create: {
      email: 'admin@pmportal.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'Admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample project
  const project1 = await prisma.project.create({
    data: {
      name: 'AI Website Redesign',
      client: 'TechCorp Inc',
      description: 'Complete website redesign using AI-driven design and development',
      status: 'InProgress',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-15'),
      tasks: {
        create: [
          {
            title: 'Design mockups with Midjourney',
            description: 'Create initial design concepts and mockups',
            assignee: 'Midjourney',
            status: 'Done',
            priority: 'High',
            estimatedHours: 8,
            actualHours: 6,
            dueDate: new Date('2024-02-10'),
          },
          {
            title: 'Review and refine designs',
            description: 'Claude reviews the designs and suggests improvements',
            assignee: 'Claude',
            status: 'Done',
            priority: 'High',
            estimatedHours: 4,
            actualHours: 3,
            dueDate: new Date('2024-02-12'),
          },
          {
            title: 'Build frontend components',
            description: 'ChatGPT builds React components based on approved designs',
            assignee: 'ChatGPT',
            status: 'InProgress',
            priority: 'High',
            estimatedHours: 16,
            dueDate: new Date('2024-02-25'),
          },
          {
            title: 'Backend API development',
            description: 'Clawdbot creates REST API endpoints',
            assignee: 'Clawdbot',
            status: 'Todo',
            priority: 'High',
            estimatedHours: 12,
            dueDate: new Date('2024-02-28'),
          },
          {
            title: 'Integration testing',
            description: 'Gemini performs integration testing and QA',
            assignee: 'Gemini',
            status: 'Todo',
            priority: 'Medium',
            estimatedHours: 8,
            dueDate: new Date('2024-03-05'),
          },
        ],
      },
      comments: {
        create: [
          {
            author: 'Admin User',
            content: 'Project kickoff! Let\'s coordinate the AI agents effectively.',
          },
        ],
      },
      activities: {
        create: [
          {
            action: 'Created',
            entity: 'Project',
            entityId: 'project1',
            actor: 'Admin User',
            details: 'Project AI Website Redesign created',
          },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      description: 'Build a cross-platform mobile app with AI features',
      status: 'Planning',
      startDate: new Date('2024-02-15'),
      dueDate: new Date('2024-04-30'),
      tasks: {
        create: [
          {
            title: 'Requirements gathering',
            description: 'Perplexity researches best practices and competition',
            assignee: 'Perplexity',
            status: 'InProgress',
            priority: 'High',
            estimatedHours: 6,
            dueDate: new Date('2024-02-20'),
          },
          {
            title: 'Architecture planning',
            description: 'Claude designs system architecture',
            assignee: 'Claude',
            status: 'Todo',
            priority: 'High',
            estimatedHours: 8,
            dueDate: new Date('2024-02-25'),
          },
        ],
      },
    },
  })

  console.log('Created sample projects:', project1.name, project2.name)
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
