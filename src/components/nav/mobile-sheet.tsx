'use client'

import { Sheet } from '@/components/ui/sheet'
import { useScreenSize } from '@/hooks/use-screen-size'
import { useEffect, useState } from 'react'

export const MobileSheet = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const { isTablet } = useScreenSize()

    useEffect(() => {
        if (!isTablet && open) setOpen(false)
    }, [isTablet, open])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {children}
        </Sheet>
    )
}
