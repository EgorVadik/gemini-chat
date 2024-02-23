import React from 'react'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className='min-h-screen grid place-content-center'>{children}</div>
    )
}
