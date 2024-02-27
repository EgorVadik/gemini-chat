import { useEffect, useState } from 'react'

type MediaQueryOptions = {
    mediaQuery: string
}

export const useMediaQuery = ({ mediaQuery }: MediaQueryOptions) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(mediaQuery)
        setMatches(mediaQueryList.matches)

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        mediaQueryList.addEventListener('change', listener)

        return () => {
            mediaQueryList.removeEventListener('change', listener)
        }
    }, [mediaQuery])

    return matches
}
