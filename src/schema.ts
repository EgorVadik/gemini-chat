import { z } from 'zod'
import { FREE_CHAR_LIMIT, PAID_CHAR_LIMIT } from './lib/constants'
import { Plan } from '@/types'

export const messageSchema = (plan: Plan) =>
    z.object({
        history: z.array(
            z
                .object({
                    content: z.string().trim(),
                    role: z.enum(['user', 'system', 'assistant']),
                })
                .refine((data) => {
                    if (data.role === 'user') {
                        return (
                            data.content.trim().length <=
                                (plan === 'FREE'
                                    ? FREE_CHAR_LIMIT
                                    : PAID_CHAR_LIMIT) &&
                            data.content.trim().length > 0
                        )
                    }
                    return true
                }),
        ),
        latestMessage: z
            .string()
            .trim()
            .min(1, 'Message is required')
            .max(
                plan === 'FREE' ? FREE_CHAR_LIMIT : PAID_CHAR_LIMIT,
                `Message must be less than ${plan === 'FREE' ? FREE_CHAR_LIMIT : PAID_CHAR_LIMIT} characters`,
            ),
    })

export const renameSchema = z.object({
    title: z.string().trim().min(1, 'title is required'),
})

export type RenameSchema = z.infer<typeof renameSchema>

export const imageGenerationSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(
            PAID_CHAR_LIMIT,
            `Prompt must be less ${PAID_CHAR_LIMIT} characters`,
        ),
})
