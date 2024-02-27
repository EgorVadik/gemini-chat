import { getUserSubscriptionInfo } from '@/actions/user'
import { Chat } from '@/components/chat'
import { MessageBox } from '@/components/forms/message-box'
import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({
    params: { id },
}: {
    params: { id: string }
}) {
    const { plan } = await getUserSubscriptionInfo()
    const chat = await prisma.chat.findUnique({
        where: {
            id,
        },
        include: {
            messages: true,
        },
    })

    if (chat == null) notFound()

    return (
        <>
            <main className='container h-full min-w-0'>
                <Chat
                    defaultMessages={chat.messages.map((m) => ({
                        content: m.content,
                        role: m.role,
                    }))}
                />
            </main>
            <MessageBox plan={plan} />
        </>
    )
}
