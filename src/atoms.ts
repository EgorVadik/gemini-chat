import { atom } from 'jotai'
import type { Generation, Message, Model } from './types'

export const modelAtom = atom<Model>('gemini')
modelAtom.onMount = (setModel) => {
    const url = new URL(window.location.href)
    const model = url.searchParams.get('model') as Model
    if (model) {
        setModel(model)
    }
}

export const generationAtom = atom<Generation>('chat')
generationAtom.onMount = (setGeneration) => {
    const url = new URL(window.location.href)
    const generation = url.searchParams.get('generation') as Generation
    if (generation) {
        setGeneration(generation)
    }
}

export const messageAtom = atom<string | null>(null)
export const messagesAtom = atom<Message[]>([])
