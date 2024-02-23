import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
    publicRoutes: ['/', '/sign-in', '/sign-up'],
    ignoredRoutes: [],
    async afterAuth(auth, req) {
        if (auth.isPublicRoute && auth.userId != null) {
            return NextResponse.redirect(new URL('/chat', req.url))
        }

        if (!auth.isPublicRoute && auth.userId == null) {
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }

        return NextResponse.next()
    },
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
