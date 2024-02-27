import { getUserChats, getUserSubscriptionInfo } from '@/actions/user'
import { GenerationsCombobox } from '@/components/combo-boxes/generations-combobox'
import { ModelCombobox } from '@/components/combo-boxes/model-combobox'
import { MessageBox } from '@/components/forms/message-box'
import { MobileSideNav } from '@/components/nav/mobile-side-nav'
import { SideNav } from '@/components/nav/side-nav'
import { ChatSkeleton } from '@/components/skeletons/chat-skeleton'
import { Plan } from '@/types'
import { auth } from '@clerk/nextjs'
import React, { Suspense } from 'react'

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = auth()
    const { chats } = await getUserChats(userId!)
    const { plan } = await getUserSubscriptionInfo()

    return (
        <div className='flex min-h-screen items-stretch'>
            <SideNav chats={chats} />
            <div className='flex grow flex-col gap-5'>
                <div className='sticky top-0 z-10 flex items-center gap-4 bg-background p-5'>
                    <MobileSideNav chats={chats} />
                    <ModelCombobox />
                    {plan === Plan.PRO && <GenerationsCombobox />}
                </div>
                <div className='flex grow flex-col justify-between px-5'>
                    <Suspense fallback={<ChatSkeleton />}>{children}</Suspense>
                    <MessageBox plan={plan} />
                </div>
            </div>
        </div>
    )
}
