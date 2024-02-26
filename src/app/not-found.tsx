import { buttonVariants } from '@/components/ui/button'
import React from 'react'

export default function NotFound() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>404 Page Not Found</h1>
            <p className='text-xl'>
                The page you are looking for does not exist.
            </p>
            <a
                href='/'
                className={buttonVariants({
                    variant: 'secondary',
                    className: 'mt-5',
                })}
            >
                Back Home
            </a>
        </main>
    )
}
