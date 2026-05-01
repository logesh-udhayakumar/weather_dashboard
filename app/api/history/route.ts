import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

// GET /api/history?city={city}&page={page}
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const skip = (page - 1) * PAGE_SIZE

    const where = city && city.trim().length > 0
      ? { cityName: { contains: city.trim(), mode: 'insensitive' as const } }
      : {}

    const [records, total] = await Promise.all([
      prisma.weatherRecord.findMany({
        where,
        orderBy: { fetchedAt: 'desc' },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.weatherRecord.count({ where }),
    ])

    return NextResponse.json({
      data: records,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        hasNext: page * PAGE_SIZE < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('GET /api/history error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
