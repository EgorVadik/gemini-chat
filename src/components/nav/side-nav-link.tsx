'use client'

import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ExtraChatOptions } from '../buttons/extra-chat-options'
import { MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export const SideNavLink = ({
    chat,
    maxWith = false,
}: {
    chat: { id: string; title: string | null }
    maxWith?: boolean
}) => {
    const pathname = usePathname()

    return (
        <Link
            className={buttonVariants({
                variant: 'ghost',
                className: cn(
                    'group relative flex w-full max-w-52 items-center justify-start gap-3',
                    {
                        'max-w-full': maxWith,
                    },
                ),
            })}
            href={`/chat/${chat.id}`}
            onClick={() => {
                window.scrollBy({ top: -window.scrollY, behavior: 'instant' })
            }}
        >
            <AnimatePresence>
                {pathname === `/chat/${chat.id}` && (
                    <motion.div
                        layoutId='side-nav-item'
                        layout
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25,
                        }}
                        className={buttonVariants({
                            variant: 'secondary',
                            className: 'absolute inset-0 z-0',
                        })}
                    />
                )}
            </AnimatePresence>
            <span className='relative z-20 block w-full truncate group-hover:max-w-40'>
                {chat.title}
            </span>
            <ExtraChatOptions
                previousTitle={chat.title ?? 'Untitled'}
                chatId={chat.id}
            >
                <span>
                    <span className='sr-only'>More Options</span>
                    <MoreHorizontal className='relative z-20 ml-auto hidden h-5 w-5 group-hover:block' />
                </span>
            </ExtraChatOptions>
        </Link>
    )
}
