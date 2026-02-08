import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      aiWorkload
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: {
          status: { in: ['Planning', 'InProgress'] }
        }
      }),
      prisma.task.count(),
      prisma.task.count({
        where: { status: 'Done' }
      }),
      prisma.task.count({
        where: { status: 'InProgress' }
      }),
      prisma.task.groupBy({
        by: ['assignee'],
        _count: {
          assignee: true
        },
        where: {
          status: { in: ['Todo', 'InProgress', 'Review'] }
        }
      })
    ])

    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0

    return NextResponse.json({
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      aiWorkload: aiWorkload.map(item => ({
        assignee: item.assignee,
        count: item._count.assignee
      }))
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
