'use client'

import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '../ui/button'
import { MessageSquarePlus } from 'lucide-react'
import { useAtom } from 'jotai'
import { messagesAtom } from '@/atoms'

export const NewChatButton = () => {
    const [, setMessages] = useAtom(messagesAtom)

    return (
        <Link
            href={'/chat'}
            className={buttonVariants({
                variant: 'ghost',
                className: 'w-full',
            })}
            onClick={() => setMessages([])}
        >
            <span className='flex w-full items-center justify-start gap-2 text-start'>
                <MessageSquarePlus />
                New Chat
            </span>
        </Link>
    )
}
