'use client'

import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

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
