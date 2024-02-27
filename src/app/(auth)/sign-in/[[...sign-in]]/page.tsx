'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

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
