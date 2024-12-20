import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = ['/login', '/signup', '/', '/faqs', '/services'].includes(path);

  // Protected paths that require authentication
  const isProtectedPath = ['/welcome', '/profile', '/admin-dashboard'].some(prefix => 
    path.startsWith(prefix)
  );

  // Get the token from the cookies
  const token = request.cookies.get('firebase-token')?.value;

  // Only handle protected paths
  if (isProtectedPath) {
    // Redirect to login if accessing protected route without token
    if (!token) {
      console.log('No token, redirecting to login from:', path);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Handle auth pages (login/signup) when user is already authenticated
  if (path === '/login' || path === '/signup') {
    if (token) {
      console.log('Has token, redirecting to welcome from:', path);
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/welcome',
    '/profile',
    '/admin-dashboard/:path*'
  ],
}; 