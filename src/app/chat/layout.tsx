import { getUserChats } from '@/actions/user'
import { ModelCombobox } from '@/components/buttons/model-combobox'
import { MobileSideNav } from '@/components/nav/mobile-side-nav'
import { SideNav } from '@/components/nav/side-nav'
import { auth } from '@clerk/nextjs'
import React from 'react'

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = auth()
    const { chats } = await getUserChats(userId!)

    return (
        <div className='flex min-h-screen items-stretch'>
            <SideNav chats={chats} />
            <div className='flex grow flex-col gap-5'>
                <div className='sticky top-0 z-10 flex items-center gap-4 bg-background p-5'>
                    <MobileSideNav chats={chats} />
                    <ModelCombobox />
                </div>
                <div className='flex grow flex-col justify-between px-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}
