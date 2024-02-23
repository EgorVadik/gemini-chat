import React from 'react'
import { ModeToggle } from '../buttons/mode-toggle'
import Link from 'next/link'

export const LandingNav = () => {
    return (
        <nav className='flex items-center justify-between py-5'>
            <h1 className='text-3xl font-bold text-primary'>Gemini Chat</h1>
            <div className='flex items-center space-x-4'>
                <a href='#home' className='text-lg font-bold text-primary'>
                    Home
                </a>
                <a href='#features' className='text-lg font-bold text-primary'>
                    Features
                </a>
                <a href='#pricing' className='text-lg font-bold text-primary'>
                    Pricing
                </a>
                <ModeToggle />
            </div>
        </nav>
    )
}
