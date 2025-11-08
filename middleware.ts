import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/new',
  '/dashboard/editor',
  '/dashboard/projects',
  '/dashboard/settings',
  '/dashboard/referrals',
];

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-email',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rate limiting
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const rateLimitKey = `rate_limit:${ip}`;
  
  // Check if IP is blocked
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: blockedIP } = await supabase
    .from('ip_blocks')
    .select('id')
    .eq('ip', ip)
    .eq('blocked_at', new Date().toISOString())
    .single();
    
  if (blockedIP) {
    return NextResponse.json(
      { error: 'IP blocked' },
      { status: 403 }
    );
  }
  
  // Rate limit check
  const { data: rateLimit } = await supabase
    .from('rate_limits')
    .select('count, reset_at')
    .eq('ip', ip)
    .single();
    
  const now = new Date();
  const resetAt = rateLimit?.reset_at ? new Date(rateLimit.reset_at) : new Date(0);
  
  if (now > resetAt) {
    // Reset rate limit
    await supabase
      .from('rate_limits')
      .upsert({
        ip,
        count: 1,
        reset_at: new Date(now.getTime() + RATE_LIMIT_WINDOW).toISOString(),
      });
  } else if ((rateLimit?.count ?? 0) >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  } else {
    // Increment count
    await supabase
      .from('rate_limits')
      .upsert({
        ip,
        count: (rateLimit?.count ?? 0) + 1,
        reset_at: rateLimit?.reset_at,
      });
  }
  
  // Authentication check
  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  
  let isAuthenticated = false;
  
  if (accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    isAuthenticated = !error && !!user;
    
    // Refresh token if needed
    if (error && refreshToken) {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      
      if (!refreshError && session) {
        isAuthenticated = true;
        const response = NextResponse.next();
        response.cookies.set('sb-access-token', session.access_token, {
          maxAge: session.expires_in,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
        response.cookies.set('sb-refresh-token', session.refresh_token, {
          maxAge: session.expires_in * 52, // 1 year
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
        return response;
      }
    }
  }
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};