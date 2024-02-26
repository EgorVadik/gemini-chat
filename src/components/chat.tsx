'use client'

import type { Message, Model, UserInfo } from '@/types'
import type { Role } from '@prisma/client'

import { messageAtom, messagesAtom, modelAtom } from '@/atoms'
import { getModelName, getUserName, getUsernameFallback } from '@/lib/utils'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { useAtom } from 'jotai'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import { Bot } from 'lucide-react'

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
    const lastElementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        lastElementRef.current?.scrollIntoView({ behavior: 'smooth' })
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
                    isLast={index === messages.length - 1}
                    elementRef={lastElementRef}
                    isDarkMode={resolvedTheme === 'dark'}
                />
            ))}

            {message != null && (
                <ChatCard
                    message={message}
                    role='system'
                    model={model}
                    isLast
                    elementRef={lastElementRef}
                    isDarkMode={resolvedTheme === 'dark'}
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
    isLast: boolean
    elementRef: React.RefObject<HTMLDivElement>
    isDarkMode: boolean
}

const ChatCard = ({
    message,
    role,
    user,
    model,
    elementRef,
    isLast,
    isDarkMode,
}: ChatCardProps) => {
    return (
        <Card ref={isLast ? elementRef : null}>
            <CardHeader>
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
            </CardHeader>
            <CardContent>
                {role !== 'user' ? (
                    <ReactMarkdown
                        className={
                            'fit-width prose break-words dark:prose-invert lg:max-w-full'
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
