import { atom } from 'jotai'
import type { Generation, Message, Model } from './types'

export const modelAtom = atom<Model>('gemini')
export const generationAtom = atom<Generation>('chat')
export const messageAtom = atom<string | null>(null)
export const messagesAtom = atom<Message[]>([])
