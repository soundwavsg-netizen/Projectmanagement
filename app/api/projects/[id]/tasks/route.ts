import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const body = await request.json()
    const { title, description, assignee, status, priority, estimatedHours, dueDate } = body

    const task = await prisma.task.create({
      data: {
        projectId: params.id,
        title,
        description,
        assignee,
        status: status || 'Todo',
        priority: priority || 'Medium',
        estimatedHours,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    })

    // Create activity
    await prisma.activity.create({
      data: {
        projectId: params.id,
        action: 'Created',
        entity: 'Task',
        entityId: task.id,
        actor: session.user?.name || 'Unknown',
        details: `Task "${title}" created and assigned to ${assignee}`,
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
