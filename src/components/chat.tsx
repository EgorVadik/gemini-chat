'use client'

import type { Message, Model, UserInfo } from '@/types'
import type { Role } from '@prisma/client'

import { messageAtom, messagesAtom, modelAtom } from '@/atoms'
import {
    extractImageUrls,
    getModelName,
    getUserName,
    getUsernameFallback,
    isImage,
} from '@/lib/utils'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { useAtom } from 'jotai'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import { Bot, Copy } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import { toast } from 'sonner'

type ChatProps = {
    defaultMessages: Message[]
}

export const Chat = ({ defaultMessages }: ChatProps) => {
    const { resolvedTheme } = useTheme()
    const { user } = useUser()
    const [message] = useAtom(messageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [model] = useAtom(modelAtom)
    const [parent] = useAutoAnimate()

    useEffect(() => {
        window.scroll({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        })
    }, [messages, message])

    useEffect(() => {
        if (defaultMessages.length === 0) return
        setMessages(defaultMessages)
    }, [setMessages, defaultMessages])

    return (
        <div className='space-y-6' ref={parent}>
            {messages.map((m, index) => (
                <ChatCard
                    key={index}
                    message={m.content}
                    role={m.role}
                    user={{
                        emailAddresses: user?.emailAddresses,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        imageUrl: user?.imageUrl,
                    }}
                    model={model}
                    isDarkMode={resolvedTheme === 'dark'}
                    isImage={isImage(m.content)}
                />
            ))}

            {message != null && (
                <ChatCard
                    message={message}
                    role='system'
                    model={model}
                    isDarkMode={resolvedTheme === 'dark'}
                    isImage={isImage(message)}
                />
            )}
        </div>
    )
}

type ChatCardProps = {
    message: string
    role: Role
    user?: UserInfo & {
        imageUrl?: string
    }
    model: Model
    isDarkMode: boolean
    isImage: boolean
}

const ChatCard = ({
    message,
    role,
    user,
    model,
    isDarkMode,
    isImage,
}: ChatCardProps) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-start justify-between'>
                <CardTitle>
                    <div className='flex items-center gap-2'>
                        {role === 'user' ? (
                            <>
                                <Avatar>
                                    <AvatarImage src={user?.imageUrl} />
                                    <AvatarFallback>
                                        {getUsernameFallback({
                                            emailAddresses:
                                                user?.emailAddresses,
                                            firstName: user?.firstName,
                                            lastName: user?.lastName,
                                        })}
                                    </AvatarFallback>
                                </Avatar>

                                {getUserName({
                                    emailAddresses: user?.emailAddresses,
                                    firstName: user?.firstName,
                                    lastName: user?.lastName,
                                })}
                            </>
                        ) : (
                            <>
                                <Bot className='h-8 w-8' />
                                <span>{getModelName(model)}</span>
                            </>
                        )}
                    </div>
                </CardTitle>
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(message)
                        toast.success('Copied to clipboard')
                    }}
                    size={'icon'}
                    variant={'outline'}
                >
                    <span className='sr-only'>Copy</span>
                    <Copy />
                </Button>
            </CardHeader>
            <CardContent>
                {isImage ? (
                    extractImageUrls(message).map((url, idx) => (
                        <Image
                            key={idx}
                            src={url}
                            alt='Image'
                            width={300}
                            height={300}
                        />
                    ))
                ) : role !== 'user' ? (
                    <ReactMarkdown
                        className={
                            'prose min-w-0 max-w-none whitespace-break-spaces text-wrap break-words dark:prose-invert'
                        }
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(
                                    className || '',
                                )
                                return match ? (
                                    <SyntaxHighlighter
                                        style={isDarkMode ? dark : undefined}
                                        language={match[1]}
                                        PreTag='div'
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code {...props} className={className}>
                                        {children}
                                    </code>
                                )
                            },
                        }}
                    >
                        {message}
                    </ReactMarkdown>
                ) : (
                    <motion.div
                        key={message}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            duration: 0.5,
                        }}
                    >
                        {message}
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}
