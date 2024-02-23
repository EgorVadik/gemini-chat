'use client'

import { SignUp } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'

export default function SignUpPage() {
    const { resolvedTheme } = useTheme()

    return (
        <SignUp
            redirectUrl={'/chat'}
            appearance={{
                baseTheme: resolvedTheme === 'dark' ? dark : undefined,
            }}
        />
    )
}
