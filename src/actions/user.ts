'use server'

import { auth, currentUser } from '@clerk/nextjs'
import { prisma } from '@/server/db'
import { DAY_IN_MS, MAX_FREE_MESSAGES, PAID_CHAR_LIMIT } from '@/lib/constants'
import { Plan, Prisma } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getAbsoluteUrl } from '@/lib/utils'
import { renameSchema } from '@/schema'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'

export const increaseApiLimit = async () => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
        }
    }

    const { plan } = await getUserSubscriptionInfo()
    if (plan === Plan.PRO) return { success: true, error: null }

    await prisma.userApiLimit.upsert({
        where: {
            userId,
        },
        update: {
            count: {
                increment: 1,
            },
        },
        create: {
            userId,
            count: 1,
        },
    })

    return {
        success: true,
        error: null,
    }
}

export const checkApiLimit = async () => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
            limit: null,
            count: null,
            plan: null,
        }
    }

    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId,
        },
    })

    const { plan } = await getUserSubscriptionInfo()

    if (userApiLimit == null || userApiLimit.count < MAX_FREE_MESSAGES) {
        return {
            success: true,
            limit: true,
            error: null,
            count: userApiLimit?.count ?? 0,
            plan,
        }
    }

    return {
        success: true,
        limit: false,
        error: null,
        count: userApiLimit.count,
        plan,
    }
}

export const getUserSubscriptionInfo = unstable_cache(
    async () => {
        const { userId } = auth()
        if (!userId) {
            return {
                success: false,
                error: 'You are not authenticated',
                plan: Plan.FREE,
                endDate: null,
                customerId: null,
                subscriptionId: null,
            }
        }

        const subscription = await prisma.userSubscription.findUnique({
            where: {
                userId,
            },
            select: {
                stripeCurrentPeriodEnd: true,
                stripeSubscriptionId: true,
                stripeCurrentPeriodStart: true,
                stripePriceId: true,
                stripeCustomerId: true,
            },
        })

        const isPro =
            subscription != null &&
            subscription.stripeCurrentPeriodEnd != null &&
            subscription.stripePriceId &&
            subscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
                Date.now()

        let isCancelled = false
        if (isPro && subscription.stripeSubscriptionId) {
            const stripeSubscription = await stripe.subscriptions.retrieve(
                subscription.stripeSubscriptionId,
            )
            isCancelled = stripeSubscription.cancel_at_period_end
        }

        return {
            success: true,
            error: null,
            plan:
                isPro != null
                    ? isPro === true
                        ? Plan.PRO
                        : Plan.FREE
                    : Plan.FREE,
            endDate: subscription?.stripeCurrentPeriodEnd?.getTime(),
            customerId: subscription?.stripeCustomerId,
            subscriptionId: subscription?.stripeSubscriptionId,
            isCancelled,
        }
    },
    ['user-plan'],
    {
        tags: ['user-plan'],
        revalidate: 3600,
    },
)

type UpdateUserChatOptions = {
    chatId: string
    userMessage: string
    systemMessage: string
    getTitle: boolean
}

export const updateUserChat = async ({
    chatId,
    userMessage,
    systemMessage,
    getTitle,
}: UpdateUserChatOptions) => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
        }
    }

    let title: string | null = null

    if (getTitle) {
        const geminiTitle = await getChatTitleGemini(userMessage)
        if (geminiTitle.title) {
            title = geminiTitle.title
        }
    }

    await prisma.chat.upsert({
        where: {
            id: chatId,
        },
        update: {
            messages: {
                createMany: {
                    data: [
                        {
                            content: userMessage,
                            role: 'user',
                            userId,
                        },
                        {
                            content: systemMessage,
                            role: 'system',
                            userId,
                        },
                    ],
                },
            },
        },
        create: {
            id: chatId,
            userId,
            title,
            messages: {
                createMany: {
                    data: [
                        {
                            content: userMessage,
                            role: 'user',
                            userId,
                        },
                        {
                            content: systemMessage,
                            role: 'system',
                            userId,
                        },
                    ],
                },
            },
        },
    })

    return {
        success: true,
        error: null,
    }
}

const getChatTitleGemini = async (content: string) => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
            title: null,
        }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const response = await model.generateContent(
        `Generate a compelling and informative title for the following text. The title should be no more than 4 words. If the text is less than 4 words, simply return the text as the title.: ${content}`,
        // `Generate one compelling and informative title for the following text return only the title no quotes nothing else than the title make the title max 4 words and if the text is less than 4 words just return the text without changing it: ${content}`,
    )
    // )

    revalidateTag('user-chats')

    return {
        success: true,
        error: null,
        title: response.response.text(),
    }
}

export const getStripeBillingPortal = async (pathname: string) => {
    const user = await currentUser()
    const { userId } = auth()
    if (!userId || !user) {
        return {
            success: false,
            error: 'You are not authenticated',
            url: null,
        }
    }

    const url = getAbsoluteUrl(pathname)
    const { plan, customerId } = await getUserSubscriptionInfo()
    if (plan === Plan.PRO) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: customerId as string,
            return_url: url,
        })

        return {
            success: true,
            error: null,
            url: stripeSession.url,
        }
    }

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: url,
        cancel_url: url,
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.emailAddresses?.[0]?.emailAddress,
        line_items: [
            {
                price_data: {
                    currency: 'USD',
                    unit_amount: 2000,
                    product_data: {
                        name: 'Pro Plan',
                        description: `Unlimited messages and ${PAID_CHAR_LIMIT} characters per message`,
                    },
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId,
        },
    })

    return {
        success: true,
        error: null,
        url: stripeSession.url,
    }
}

export const getUserChats = unstable_cache(
    async (userId: string) => {
        const chats = await prisma.chat.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return {
            success: true,
            error: null,
            chats,
        }
    },
    ['user-chats'],
    {
        tags: ['user-chats'],
    },
)

export const deleteChat = async (chatId: string) => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
        }
    }
    try {
        await prisma.chat.delete({
            where: {
                id: chatId,
            },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Chat not found',
                }
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return {
                success: false,
                error: 'Invalid chat id',
            }
        }

        return {
            success: false,
            error: 'Something went wrong. Please try again later',
        }
    }

    revalidateTag('user-chats')

    return {
        success: true,
        error: null,
    }
}

export const renameChat = async (chatId: string, title: string) => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
        }
    }

    try {
        const validData = renameSchema.parse({ title })
        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                title: validData.title,
            },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Chat not found',
                }
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return {
                success: false,
                error: 'Invalid chat id',
            }
        }

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message,
            }
        }

        return {
            success: false,
            error: 'Something went wrong. Please try again later',
        }
    }

    revalidateTag('user-chats')

    return {
        success: true,
        error: null,
    }
}
