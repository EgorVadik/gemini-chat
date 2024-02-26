import { MenuSquare } from 'lucide-react'
import { SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Chat } from '@/types'
import { SideNavLink } from './side-nav-link'
import { Suspense } from 'react'
import { UserPlan } from '../user-plan'
import { UserProfileButton } from '../buttons/user-profile-button'
import { ScrollArea } from '../ui/scroll-area'
import { NewChatButton } from '../buttons/new-chat-button'
import { getUserSubscriptionInfo } from '@/actions/user'
import { SettingsButton } from '../buttons/settings-button'
import { Plan } from '@prisma/client'
import { MobileSheet } from './mobile-sheet'

export const MobileSideNav = async ({ chats }: { chats: Chat }) => {
    const { plan, isCancelled, endDate } = await getUserSubscriptionInfo()

    return (
        <MobileSheet>
            <SheetTrigger>
                <MenuSquare className='flex xl:hidden' />
            </SheetTrigger>
            <SheetContent
                side={'left'}
                className='flex w-fit max-w-[16.25rem] flex-col justify-between xl:hidden'
            >
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
            </SheetContent>
        </MobileSheet>
    )
}
