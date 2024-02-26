import { getUserSubscriptionInfo } from '@/actions/user'
import { MessageBox } from '@/components/forms/message-box'
import { Bot } from 'lucide-react'
import React from 'react'

export default async function page() {
    const { plan } = await getUserSubscriptionInfo()
    return (
        <>
            <main className='container flex h-full items-center justify-center'>
                <h2 className='flex flex-col items-center justify-center gap-3 text-center text-3xl font-bold'>
                    <Bot className='h-16 w-16' />
                    How can i help you today?
                </h2>
            </main>
            <MessageBox plan={plan} />
        </>
    )
}
