import type { Message as PrismaMessage } from '@prisma/client'

export type Model = 'gemini' | 'chatgpt35' | 'chatgpt4' | 'dalle2' | 'dalle3'

export type Generation = 'code' | 'chat' | 'image'

export type Message = Pick<PrismaMessage, 'content' | 'role'>

export type UserInfo = {
    firstName?: string | null
    lastName?: string | null
    emailAddresses?: {
        emailAddress: string
    }[]
}

export type Endpoint =
    | '/api/chat/gemini'
    | '/api/chat/gpt-3'
    | '/api/chat/gpt-4'
    | '/api/code/gemini'
    | '/api/code/gpt-3'
    | '/api/code/gpt-4'
    | '/api/image/dall-e-2'
    | '/api/image/dall-e-3'

export type Chat =
    | {
          id: string
          title: string | null
      }[]
    | undefined

export type UserSettingsProps = {
    plan: Plan
    subscriptionPlan: {
        isCanceled: boolean | null
        stripeCurrentPeriodEnd: string | number | null
    }
    description: string
    loading: boolean
    getUrl: () => void
    open: boolean
    setOpen: (open: boolean) => void
}

export enum Plan {
    FREE = 'FREE',
    PRO = 'PRO',
}
