'use client'

import { getStripeBillingPortal } from '@/actions/user'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const useBilling = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const getUrl = async () => {
        setLoading(true)
        const { error, success, url } = await getStripeBillingPortal(pathname)

        if (error || !success) {
            setLoading(false)
            toast.error(error)
            return
        }

        setLoading(false)
        if (url) router.push(url)
    }

    return {
        loading,
        getUrl,
    }
}
