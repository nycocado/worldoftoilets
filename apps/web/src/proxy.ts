import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export default function proxy(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname === '/health') {
        return NextResponse.json({status: 'ok'});
    }

    // Protected routes that require authentication
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Auth pages redirect to dashboard if already logged in
    if (pathname.startsWith('/auth/') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/health/:path*', '/dashboard/:path*', '/auth/:path*'],
};
