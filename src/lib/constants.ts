export const MAX_FREE_MESSAGES = 50

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
            '750 characters per message',
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
            '4096 characters per message',
        ],
    },
    {
        title: 'Enterprise',
        price: 50,
        features: [
            'Unlimited Chat with Gemini',
            'Unlimited Chat with GPT-3.5',
            'Unlimited Chat with GPT-4',
            'Image generation with DALL-E',
            'Video generation with VQ-VAE-2',
            '8192 characters per message',
        ],
    },
]
