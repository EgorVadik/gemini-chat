import { Model, UserInfo } from '@/types'
import type { User } from '@clerk/nextjs/server'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getUserName(user: UserInfo) {
    if (user?.firstName && user?.lastName) {
        return user.firstName + ' ' + user.lastName
    }

    if (user?.firstName) {
        return user.firstName
    }

    if (user?.lastName) {
        return user.lastName
    }

    return user?.emailAddresses?.[0]?.emailAddress
}

export function getModelName(model: Model) {
    switch (model) {
        case 'gemini':
            return 'Gemini'
        case 'chatgpt35':
            return 'ChatGPT-3.5'
        case 'chatgpt4':
            return 'ChatGPT-4'
        default:
            return ''
    }
}

export function getUsernameFallback(user: UserInfo) {
    const { firstName, lastName, emailAddresses } = user
    if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`
    }
    if (firstName) {
        return firstName.charAt(0) + firstName.charAt(1)
    }
    if (lastName) {
        return lastName.charAt(0) + lastName.charAt(1)
    }
    if (emailAddresses) {
        return (
            emailAddresses?.[0]?.emailAddress.charAt(0) +
            emailAddresses?.[0]?.emailAddress.charAt(1)
        )
    }

    return 'FB'
}

export function getAbsoluteUrl(url: string) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
}

export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }