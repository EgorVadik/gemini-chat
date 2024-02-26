import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'
import { messageSchema } from '@/schema'
import { checkApiLimit, increaseApiLimit } from '@/actions/user'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Plan } from '@prisma/client'
import { MAX_FREE_MESSAGES } from '@/lib/constants'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function POST(req: Request) {
    const data = await req.json()
    try {
        const { count, error, limit, success, plan } = await checkApiLimit()
        const { history, latestMessage } = messageSchema(
            plan ?? Plan.FREE,
        ).parse(data)

        if (!success) {
            return NextResponse.json(
                { message: error },
                {
                    status: 401,
                },
            )
        }

        if (
            (plan == null || plan === Plan.FREE) &&
            (!limit || count >= MAX_FREE_MESSAGES)
        ) {
            return NextResponse.json(
                {
                    message: 'You have reached your message limit',
                },
                {
                    status: 402,
                },
            )
        }

        const chat = model.startChat({
            history: history.map((message) => ({
                role: message.role === 'user' ? message.role : 'model',
                parts: [
                    {
                        text: message.content,
                    },
                ],
            })),
        })

        const response = await chat.sendMessageStream(latestMessage)
        const stream = GoogleGenerativeAIStream(response)

        await increaseApiLimit()
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
