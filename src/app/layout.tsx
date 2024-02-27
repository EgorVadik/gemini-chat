import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
    title: 'GeminiChat',
    description:
        'Gemini Chat is a platform for interacting with different AI language models, including GPT-3.5, GPT-4, and Gemini.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={GeistSans.className}>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
