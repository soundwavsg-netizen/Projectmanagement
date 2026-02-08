import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(
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
    const { title, description, assignee, status, priority, estimatedHours, actualHours, dueDate } = body

    const oldTask = await prisma.task.findUnique({
      where: { id: params.id }
    })

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        assignee,
        status,
        priority,
        estimatedHours,
        actualHours,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    })

    // Create activity if status changed
    if (oldTask && oldTask.status !== status) {
      await prisma.activity.create({
        data: {
          projectId: task.projectId,
          action: 'StatusChanged',
          entity: 'Task',
          entityId: task.id,
          actor: session.user?.name || 'Unknown',
          details: `Task "${title}" status changed from ${oldTask.status} to ${status}`,
        }
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const task = await prisma.task.findUnique({
      where: { id: params.id }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id }
    })

    // Create activity
    await prisma.activity.create({
      data: {
        projectId: task.projectId,
        action: 'Deleted',
        entity: 'Task',
        entityId: task.id,
        actor: session.user?.name || 'Unknown',
        details: `Task "${task.title}" deleted`,
      }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
