export const MAX_FREE_MESSAGES = 50
export const FREE_CHAR_LIMIT = 750
export const PAID_CHAR_LIMIT = 8192 * 2
export const DAY_IN_MS = 86_400_000

export const FEATURES = [
    {
        title: 'Seamless Conversation',
        description:
            'Switch between 3 different AI language models using the same chat',
    },
    {
        title: 'Real-Time Chat',
        description: 'Chat with AI language models in real-time',
    },
]

export const PRICING = [
    {
        title: 'Starter',
        price: 0,
        features: [
            'Chat with Gemini',
            'Chat with GPT-3.5',
            'Chat with GPT-4',
            'Limited to 50 messages',
            `${FREE_CHAR_LIMIT} characters per message`,
        ],
    },
    {
        title: 'Pro',
        price: 20,
        features: [
            'Unlimited Chat with Gemini',
            'Unlimited Chat with GPT-3.5',
            'Unlimited Chat with GPT-4',
            'Image generation with DALL-E',
            `${PAID_CHAR_LIMIT} characters per message`,
        ],
    },
] as const

export const MODELS = [
    {
        value: 'gemini',
        label: 'Gemini',
    },
    {
        value: 'chatgpt35',
        label: 'ChatGPT-3.5',
    },
    {
        value: 'chatgpt4',
        label: 'ChatGPT-4',
    },
    {
        value: 'dalle2',
        label: 'DALL-E 2',
    },
    {
        value: 'dalle3',
        label: 'DALL-E 3',
    },
] as const

export const GENERATIONS = [
    {
        value: 'chat',
        label: 'Chat',
    },
    {
        value: 'code',
        label: 'Code',
    },
    {
        value: 'image',
        label: 'Image',
    },
] as const
