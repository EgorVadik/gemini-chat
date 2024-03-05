import { Chat } from '@/components/chat'
import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'

export default async function page({
    params: { id },
}: {
    params: { id: string }
}) {
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
        <main className='container h-full min-w-0 max-sm:p-0'>
            <Chat
                defaultMessages={chat.messages.map((m) => ({
                    content: m.content,
                    role: m.role,
                }))}
            />
        </main>
    )
}
