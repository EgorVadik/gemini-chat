'use client'

import { SignIn } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'

export default function LoginPage() {
    const { resolvedTheme } = useTheme()

    return (
        <SignIn
            redirectUrl={'/chat'}
            appearance={{
                baseTheme: resolvedTheme === 'dark' ? dark : undefined,
            }}
        />
    )
}
