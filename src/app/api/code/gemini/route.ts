import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'
import { messageSchema } from '@/schema'
import { getUserSubscriptionInfo } from '@/actions/user'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { Plan } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

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

        const _history = [
            {
                role: 'user',
                parts: [
                    {
                        text: instructionMessage.content,
                    },
                ],
            },
            {
                role: 'model',
                parts: [
                    {
                        text: '',
                    },
                ],
            },
            ...history.map((message) => ({
                role: message.role === 'user' ? message.role : 'model',
                parts: [
                    {
                        text: message.content,
                    },
                ],
            })),
        ]

        const chat = model.startChat({
            history: _history,
        })

        const response = await chat.sendMessageStream(latestMessage)
        const stream = GoogleGenerativeAIStream(response)
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
