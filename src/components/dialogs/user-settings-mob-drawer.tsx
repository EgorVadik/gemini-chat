import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'

import { Button } from '../ui/button'
import { Loader2, Settings2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Plan, type UserSettingsProps } from '@/types'

export const UserSettingsMobDrawer = ({
    plan,
    subscriptionPlan,
    description,
    loading,
    getUrl,
    open,
    setOpen,
}: UserSettingsProps) => {
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size={'icon'}>
                    <span className='sr-only'>Settings</span>
                    <Settings2 />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className='text-left'>
                    <DrawerTitle>Subscription Plan</DrawerTitle>
                    <DrawerDescription className='flex gap-1'>
                        You are currently on the
                        <span className='underline'>{plan}</span>
                        plan
                    </DrawerDescription>
                </DrawerHeader>
                <div className='space-y-4 px-4 pb-10'>
                    <p className='text-balance'>{description}</p>
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
                        <div className='flex flex-col-reverse items-center justify-between gap-2 sm:flex-row sm:gap-1'>
                            <Button
                                onClick={getUrl}
                                disabled={loading}
                                className='flex items-center justify-center gap-2 max-sm:w-full'
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
                                {subscriptionPlan?.stripeCurrentPeriodEnd &&
                                    formatDate(
                                        subscriptionPlan?.stripeCurrentPeriodEnd,
                                    )}
                                .
                            </span>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
