import { NextResponse } from 'next/server';

export function middleware(request) {
    // Serve the static robot.html for the root path
    if (request.nextUrl.pathname === '/') {
        return NextResponse.rewrite(new URL('/robot.html', request.url));
    }
}

export const config = {
    matcher: '/'
};
