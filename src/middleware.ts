import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter using Upstash Redis
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: '@upstash/ratelimit',
});

export async function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new NextResponse('Too many requests', {
        status: 429,
        headers: {
          'Retry-After': '10',
          'Content-Type': 'text/plain',
        },
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
