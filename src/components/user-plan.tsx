import { checkApiLimit, getUserSubscriptionInfo } from '@/actions/user'
import React from 'react'
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card'
import { Plan } from '@prisma/client'
import { MAX_FREE_MESSAGES } from '@/lib/constants'
import { Progress } from '@/components/ui/progress'
import { UpgradePlanButton } from './buttons/upgrade-plan-button'

export const UserPlan = async () => {
    const { plan } = await getUserSubscriptionInfo()
    if (plan !== Plan.FREE) return null
    const { count } = await checkApiLimit()

    return (
        <Card>
            <CardHeader className='text-center font-bold'>
                <span>
                    {count} / {MAX_FREE_MESSAGES} Messages
                </span>
            </CardHeader>
            <CardContent>
                <Progress
                    value={
                        count === 0 || count == null
                            ? count
                            : (count / MAX_FREE_MESSAGES) * 100
                    }
                />
            </CardContent>
            <CardFooter>
                <UpgradePlanButton />
            </CardFooter>
        </Card>
    )
}
