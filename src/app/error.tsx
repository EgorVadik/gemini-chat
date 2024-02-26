'use client'

import { buttonVariants } from '@/components/ui/button'

export default function error() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>Oops</h1>
            <p className='text-xl'>
                An error has occured. Please try again later.
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
