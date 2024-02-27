import OpenAI from 'openai'
import { getUserSubscriptionInfo } from '@/actions/user'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Plan } from '@/types'
import { imageGenerationSchema } from '@/schema'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    if (true) {
        return NextResponse.json(
            {
                message:
                    'Lets not use image generation for now. its bad and expensive.',
            },
            {
                status: 400,
            },
        )
    }

    const data = await req.json()
    try {
        const { prompt } = imageGenerationSchema.parse({
            prompt: data?.latestMessage,
        })
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

        const response = await openai.images.generate({
            prompt,
            model: 'dall-e-2',
            response_format: 'url',
            size: '1024x1024',
            n: 1,
        })

        return NextResponse.json(
            {
                urls: response.data.map((data) => data.url),
            },
            {
                status: 200,
            },
        )
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
