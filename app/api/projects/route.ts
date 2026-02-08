import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where = {
      ...(status && status !== 'all' ? { status } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search } },
          { client: { contains: search } },
          { description: { contains: search } },
        ]
      } : {})
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true,
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, client, description, status, startDate, dueDate } = body

    const project = await prisma.project.create({
      data: {
        name,
        client,
        description,
        status: status || 'Planning',
        startDate: new Date(startDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        activities: {
          create: {
            action: 'Created',
            entity: 'Project',
            actor: session.user?.name || 'Unknown',
            details: `Project ${name} created`,
          }
        }
      },
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true,
            comments: true,
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
