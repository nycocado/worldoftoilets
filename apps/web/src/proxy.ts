import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/health') {
    return NextResponse.json({ status: 'ok' });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/health',
};
