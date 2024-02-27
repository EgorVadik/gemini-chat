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
import { formatDate } from '@/lib/utils'
import { Plan, type UserSettingsProps } from '@/types'

export const UserSettingsDialog = ({
    plan,
    subscriptionPlan,
    description,
    loading,
    getUrl,
    open,
    setOpen,
}: UserSettingsProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <p>{description}</p>
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
                                {subscriptionPlan?.stripeCurrentPeriodEnd &&
                                    formatDate(
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
