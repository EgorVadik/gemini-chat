'use client'

import { getUserName } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export const UserProfileButton = () => {
    const { user } = useUser()
    const { resolvedTheme } = useTheme()

    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <UserButton
                    appearance={{
                        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
                    }}
                    userProfileProps={{
                        appearance: {
                            baseTheme:
                                resolvedTheme === 'dark' ? dark : undefined,
                        },
                    }}
                />
                {getUserName({
                    emailAddresses: user?.emailAddresses,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                })}
            </div>

            <ModeToggle />
        </div>
    )
}
