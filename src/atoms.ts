import { atom } from 'jotai'
import { Message, Model } from './types'

export const modelAtom = atom<Model>('gemini')
export const messageAtom = atom<string | null>(null)
export const messagesAtom = atom<Message[]>([])
