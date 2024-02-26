import React from 'react'

export const useScreenSize = () => {
    const [isTablet, setIsTablet] = React.useState(false)

    React.useEffect(() => {
        const handleResize = () => {
            setIsTablet(window.innerWidth < 1280)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
        isTablet,
    }
}
