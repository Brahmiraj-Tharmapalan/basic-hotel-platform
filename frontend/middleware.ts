import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Get the access token from cookies
    const token = request.cookies.get('access_token')?.value

    // If trying to access a protected route without a token, redirect to login
    if (!isPublicRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // If logged in and trying to access login page, redirect to hotels
    if (isPublicRoute && token && pathname === '/login') {
        const hotelsUrl = new URL('/hotels', request.url)
        return NextResponse.redirect(hotelsUrl)
    }

    return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        '/',
        '/hotels/:path*',
        '/((?!_next|api|favicon.ico).*)',
    ],
}
