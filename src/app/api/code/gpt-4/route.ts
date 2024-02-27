import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { messageSchema } from '@/schema'
import { getUserSubscriptionInfo } from '@/actions/user'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Plan } from '@/types'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const instructionMessage = {
    role: 'system',
    content:
        'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
} as const

export async function POST(req: Request) {
    const data = await req.json()
    try {
        const { plan, success, error } = await getUserSubscriptionInfo()

        if (!success) {
            return NextResponse.json(
                { message: error },
                {
                    status: 401,
                },
            )
        }

        if (plan == null || plan === Plan.FREE) {
            return NextResponse.json(
                {
                    message: 'You must be on a paid plan to use this feature.',
                },
                {
                    status: 402,
                },
            )
        }

        const { history, latestMessage } = messageSchema(plan).parse(data)
        const messages: typeof history = [
            ...history,
            {
                content: latestMessage,
                role: 'user',
            },
        ]

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            stream: true,
            messages: [instructionMessage, ...messages],
        })
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: 'Max character limit exceeded. Please try again.',
                },
                {
                    status: 400,
                },
            )
        }

        return NextResponse.json(
            {
                message:
                    'An error occurred while processing your request. Please try again.',
            },
            {
                status: 500,
            },
        )
    }
}
