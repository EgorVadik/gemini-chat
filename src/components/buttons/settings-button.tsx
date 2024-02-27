'use client'

import {
    FREE_CHAR_LIMIT,
    MAX_FREE_MESSAGES,
    PAID_CHAR_LIMIT,
} from '@/lib/constants'
import { useBilling } from '@/hooks/use-billing'
import { UserSettingsDialog } from '../dialogs/user-settings-dialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { UserSettingsMobDrawer } from '../dialogs/user-settings-mob-drawer'
import { Plan } from '@/types'

type SettingsButtonProps = {
    plan: Plan
    subscriptionPlan: {
        isCanceled: boolean | null
        stripeCurrentPeriodEnd: string | number | null
    }
}

export const SettingsButton = ({
    plan,
    subscriptionPlan,
}: SettingsButtonProps) => {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery({
        mediaQuery: '(min-width: 768px)',
    })
    const { loading, getUrl } = useBilling()
    const getDescription = () => {
        switch (plan) {
            case Plan.FREE:
                return `The free plan is limited to ${FREE_CHAR_LIMIT} characters per message, and has a limit of ${MAX_FREE_MESSAGES} messages. Upgrade to the PRO plan to gain ${PAID_CHAR_LIMIT} characters per message and unlimited messages.`
            case Plan.PRO:
                return `The PRO plan has a limit of ${PAID_CHAR_LIMIT} characters per message and unlimited messages.`
            default:
                return ''
        }
    }

    if (isDesktop)
        return (
            <UserSettingsDialog
                plan={plan}
                subscriptionPlan={subscriptionPlan}
                description={getDescription()}
                loading={loading}
                getUrl={getUrl}
                open={open}
                setOpen={setOpen}
            />
        )

    return (
        <UserSettingsMobDrawer
            plan={plan}
            subscriptionPlan={subscriptionPlan}
            description={getDescription()}
            loading={loading}
            getUrl={getUrl}
            open={open}
            setOpen={setOpen}
        />
    )
}
