"use client"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

type AuthGuardProps = {
    children: ReactNode
}
export function AuthGuard({children}: AuthGuardProps) {
    const router = useRouter()
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    useEffect(()=>{
        const token = localStorage.getItem('accessToken')

        if(!token) {
            router.replace('/login')
            return
        }

        setAuthenticated(true)
    }, [router])

    if(!authenticated) return null

    return <>{children}</>
}