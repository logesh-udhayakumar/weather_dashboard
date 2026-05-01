import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow all authenticated users through
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Protect these routes — they require authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forecast/:path*',
    '/history/:path*',
    '/api/locations/:path*',
    '/api/history/:path*',
  ],
}
