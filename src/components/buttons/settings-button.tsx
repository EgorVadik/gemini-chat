'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Loader2, Settings2 } from 'lucide-react'
import { Plan } from '@prisma/client'
import {
    FREE_CHAR_LIMIT,
    MAX_FREE_MESSAGES,
    PAID_CHAR_LIMIT,
} from '@/lib/constants'
import { useBilling } from '@/hooks/use-billing'
import { formatDate } from '@/lib/utils'

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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <span className='sr-only'>Settings</span>
                    <Settings2 />
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-3xl'>
                <DialogHeader>
                    <DialogTitle>Subscription Plan</DialogTitle>
                    <DialogDescription className='flex gap-1'>
                        You are currently on the
                        <span className='underline'>{plan}</span>
                        plan
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    <p>{getDescription()}</p>
                    {plan === Plan.FREE ? (
                        <Button
                            disabled={loading}
                            onClick={getUrl}
                            className='flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <Loader2 className='animate-spin' />
                            ) : null}
                            <span className='font-bold'>Upgrade</span>
                        </Button>
                    ) : (
                        <div className='flex items-center justify-between'>
                            <Button
                                onClick={getUrl}
                                disabled={loading}
                                className='flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <Loader2 className='animate-spin' />
                                ) : null}
                                <span className='font-bold'>
                                    Manage Subscription
                                </span>
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                                {subscriptionPlan?.isCanceled
                                    ? 'Your plan will be canceled on '
                                    : 'Your plan renews on '}
                                {subscriptionPlan?.stripeCurrentPeriodEnd && formatDate(
                                    subscriptionPlan?.stripeCurrentPeriodEnd,
                                )}
                                .
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
