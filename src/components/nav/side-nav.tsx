import { Suspense } from 'react'
import { UserProfileButton } from '../buttons/user-profile-button'
import { UserPlan } from '../user-plan'
import { NewChatButton } from '../buttons/new-chat-button'
import { ScrollArea } from '../ui/scroll-area'
import { getUserSubscriptionInfo } from '@/actions/user'
import { SettingsButton } from '../buttons/settings-button'
import { SideNavLink } from './side-nav-link'
import { Plan } from '@prisma/client'
import { Chat } from '@/types'

type SideNavProps = {
    chats: Chat
}

export const SideNav = async ({ chats }: SideNavProps) => {
    const { plan, isCancelled, endDate } = await getUserSubscriptionInfo()

    return (
        <aside className='sticky left-0 top-0 z-40 hidden h-dvh w-full max-w-[16.25rem] shrink-0 flex-col justify-between border-r p-5 shadow-2xl xl:flex'>
            <nav>
                <div className='flex items-center gap-2'>
                    <NewChatButton />
                    <SettingsButton
                        plan={plan}
                        subscriptionPlan={{
                            isCanceled: isCancelled ?? false,
                            stripeCurrentPeriodEnd:
                                endDate ?? new Date().toISOString(),
                        }}
                    />
                </div>
                <ul className='mt-1 border-t pt-3'>
                    <ScrollArea
                        style={{
                            height:
                                plan === Plan.FREE
                                    ? 'calc(100vh - 21.5rem)'
                                    : 'calc(100vh - 9.5rem)',
                        }}
                    >
                        {chats?.map((chat) => (
                            <li key={chat.id}>
                                <SideNavLink chat={chat} />
                            </li>
                        ))}
                    </ScrollArea>
                </ul>
            </nav>

            <div className='space-y-4'>
                <Suspense fallback={'Loading..'}>
                    <UserPlan />
                </Suspense>
                <UserProfileButton />
            </div>
        </aside>
    )
}
