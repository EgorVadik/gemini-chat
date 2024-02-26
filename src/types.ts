import type { Message as PrismaMessage } from '@prisma/client'

export type Model = 'gemini' | 'chatgpt35' | 'chatgpt4'

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

export type Chat =
    | {
          id: string
          title: string | null
      }[]
    | undefined
