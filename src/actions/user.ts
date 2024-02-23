'use server'

import { auth } from '@clerk/nextjs'
import { prisma } from '@/server/db'
import { MAX_FREE_MESSAGES } from '@/lib/constants'

export const increaseApiLimit = async () => {
    const { userId } = auth()
    if (!userId) {
        return {
            success: false,
            error: 'You are not authenticated',
        }
    }

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
        }
    }

    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId,
        },
    })

    if (userApiLimit == null || userApiLimit.count < MAX_FREE_MESSAGES) {
        return {
            success: true,
            limit: true,
            error: null,
        }
    }

    return {
        success: true,
        limit: false,
        error: null,
    }
}
