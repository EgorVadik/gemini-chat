'use client'

import { useBilling } from '@/hooks/use-billing'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export const UpgradePlanButton = () => {
    const { loading, getUrl } = useBilling()

    return (
        <Button
            disabled={loading}
            onClick={getUrl}
            className='flex w-full items-center justify-center gap-2'
        >
            {loading ? <Loader2 className='animate-spin' /> : null}
            <span className='font-bold'>Upgrade</span>
        </Button>
    )
}
