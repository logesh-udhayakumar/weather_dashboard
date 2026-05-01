import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// GET /api/locations - Get all saved locations for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await prisma.savedLocation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: locations })
  } catch (error) {
    console.error('GET /api/locations error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST /api/locations - Save a city for authenticated user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cityName, country, lat, lon } = body

    if (!cityName || !country) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'cityName and country are required' },
        { status: 400 }
      )
    }

    // Upsert to prevent duplicates
    const location = await prisma.savedLocation.upsert({
      where: {
        userId_cityName: {
          userId: session.user.id,
          cityName: cityName,
        },
      },
      update: { country, lat, lon },
      create: {
        cityName,
        country,
        lat: lat ?? null,
        lon: lon ?? null,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ data: location, message: 'Location saved successfully' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/locations error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to save location' },
      { status: 500 }
    )
  }
}

// DELETE /api/locations?id={id} - Remove a saved location
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Location ID is required' },
        { status: 400 }
      )
    }

    // Ensure location belongs to the authenticated user
    const location = await prisma.savedLocation.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Location not found' },
        { status: 404 }
      )
    }

    await prisma.savedLocation.delete({ where: { id } })

    return NextResponse.json({ message: 'Location removed successfully' })
  } catch (error) {
    console.error('DELETE /api/locations error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to remove location' },
      { status: 500 }
    )
  }
}
