import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className='grid min-h-screen place-content-center gap-2'>
            <Link
                href='/'
                className={buttonVariants({
                    variant: 'link',
                    className: 'flex w-fit items-center gap-2',
                })}
            >
                <ArrowLeft />
                Home
            </Link>
            {children}
        </div>
    )
}
