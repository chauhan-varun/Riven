import { clerkMiddleware } from '@clerk/nextjs/server';

// Authentication checks are done at the resource level (pages, route handlers)
// rather than in middleware. See: https://clerk.com/docs/guides/development/upgrading/upgrade-guides/migrate-from-create-route-matcher
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
