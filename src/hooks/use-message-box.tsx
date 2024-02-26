'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import type { Plan } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FREE_CHAR_LIMIT, PAID_CHAR_LIMIT } from '@/lib/constants'
import { useAtom } from 'jotai'
import { messageAtom, messagesAtom, modelAtom } from '@/atoms'
import type { Endpoint } from '@/types'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import ObjectId from 'bson-objectid'
import { updateUserChat } from '@/actions/user'

export const useMessageBox = ({ plan }: { plan: Plan }) => {
    const [model] = useAtom(modelAtom)
    const [maxCharError, setMaxCharError] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [, setStreamedMessage] = useAtom(messageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [loading, setLoading] = useState(false)
    const pathName = usePathname()
    const router = useRouter()

    const messageSchema = useMemo(
        () =>
            z.object({
                message: z
                    .string()
                    .trim()
                    .min(1, 'Message is required')
                    .max(
                        plan === 'FREE' ? FREE_CHAR_LIMIT : PAID_CHAR_LIMIT,
                        `Message must be less than ${plan === 'FREE' ? FREE_CHAR_LIMIT : PAID_CHAR_LIMIT} characters`,
                    ),
            }),
        [plan],
    )
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            message: '',
        },
    })
    const message = form.watch('message')

    useEffect(() => {
        if (message.trim().length === 0) return
        if (
            message.length >
            (plan === 'FREE' ? FREE_CHAR_LIMIT : PAID_CHAR_LIMIT)
        ) {
            setMaxCharError(true)
        } else {
            setMaxCharError(false)
        }
        form.trigger('message')
    }, [form, message, plan])

    useEffect(() => {
        const textarea = textAreaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [message])

    const updateMessages = useCallback(
        (data: string) => {
            setMessages((prev) => [
                ...prev,
                {
                    content: data,
                    role: 'system',
                },
            ])
            setStreamedMessage(null)
        },
        [setMessages, setStreamedMessage],
    )

    const handleError = useCallback(
        (error: string) => {
            toast.error(error)
            setStreamedMessage(null)
            setMessages((prev) => prev.slice(0, prev.length - 1))
        },
        [setMessages, setStreamedMessage],
    )

    const handleFetch = useCallback(
        async (data: string, endpoint: Endpoint, chatId: string) => {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: messages,
                    latestMessage: data,
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                handleError(error.message)
                return
            }

            const stream = res.body
            const reader = stream?.getReader()
            let response = ''
            while (true) {
                const { done, value } = await reader!.read()
                if (done) {
                    updateMessages(response)
                    break
                }
                response += new TextDecoder('utf-8').decode(value)
                setStreamedMessage(response)
            }

            await updateUserChat({
                chatId,
                userMessage: data,
                systemMessage: response,
                getTitle: messages.length === 0,
            })
        },
        [handleError, messages, setStreamedMessage, updateMessages],
    )

    const onSubmit = form.handleSubmit(async (data) => {
        setLoading(true)
        let id = new ObjectId().toHexString()
        if (pathName === '/chat') router.push(`/chat/${id}`)
        else id = pathName.split('/').pop()!

        setMessages((prev) => [
            ...prev,
            {
                content: data.message,
                role: 'user',
            },
        ])
        form.reset()

        switch (model) {
            case 'gemini':
                await handleFetch(data.message, '/api/chat/gemini', id)
                break
            case 'chatgpt35':
                await handleFetch(data.message, '/api/chat/gpt-3', id)
                break
            case 'chatgpt4':
                await handleFetch(data.message, '/api/chat/gpt-4', id)
                break

            default:
                toast.error(
                    'Invalid model selected. Please refresh the page and try again.',
                )
                break
        }
        router.refresh()
        setLoading(false)
    })

    return {
        form,
        textAreaRef,
        onSubmit,
        maxCharError,
        model,
        message,
        messages,
        loading,
    }
}
