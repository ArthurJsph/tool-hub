import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useUrlState() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    const setUrlState = useCallback(
        (name: string, value: string) => {
            router.push(pathname + '?' + createQueryString(name, value))
        },
        [router, pathname, createQueryString]
    )

    const getUrlState = useCallback(
        (name: string) => {
            return searchParams.get(name)
        },
        [searchParams]
    )

    return {
        setUrlState,
        getUrlState,
        searchParams
    }
}
