import { NextResponse } from 'next/server';

// This middleware runs on every request and handles locale redirects
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip for asset requests, api routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Skip files like favicon.ico, etc.
  ) {
    return NextResponse.next();
  }

  // Check if the path already has a valid locale
  if (pathname.startsWith('/en') || pathname.startsWith('/es')) {
    return NextResponse.next();
  }

  // Redirect to default locale (English)
  // For example, /blogs -> /en/blogs
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/en${pathname}`;
  
  return NextResponse.redirect(newUrl);
}

// Configure the paths where this middleware should run
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes (/api/*)
    // - Static files (/_next/*)
    // - Files with extensions (e.g., favicon.ico)
    '/((?!api|_next|.*\\.).*)',
  ],
};