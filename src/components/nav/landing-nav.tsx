import React from 'react'
import { ModeToggle } from '../buttons/mode-toggle'

export const LandingNav = () => {
    return (
        <nav className='flex items-center justify-between py-5'>
            <h1 className='text-3xl font-bold text-primary'>Gemini Chat</h1>
            <div className='flex items-center space-x-4'>
                <a
                    href='#home'
                    className='hidden text-lg font-bold text-primary sm:block'
                >
                    Home
                </a>
                <a
                    href='#features'
                    className='hidden text-lg font-bold text-primary sm:block'
                >
                    Features
                </a>
                <a
                    href='#pricing'
                    className='hidden text-lg font-bold text-primary sm:block'
                >
                    Pricing
                </a>
                <ModeToggle />
            </div>
        </nav>
    )
}
