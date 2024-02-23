import { prisma } from '@/server/db'
import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'

export default async function page() {
    const { userId } = auth()
    const chats = await prisma.userChat.findUnique({
        where: {
            userId: userId!,
        },
        include: {
            chats: true,
        },
    })

    // console.log(chats)

    return (
        <div>
            <UserButton />
        </div>
    )
}
