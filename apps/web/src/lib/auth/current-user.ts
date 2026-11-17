export type CurrentUser = {
    id: string,
    email: string,
    organizationId: string,
    role: "ADMIN" | "OWNER" | "MEMBER" | "VIEWER"
}

export function getCurrentUser(): CurrentUser | null {
    if(typeof window === "undefined") return null

    const token = localStorage.getItem("accessToken")

    if(!token) return null

    try {
        const payload = JSON.parse(
            window.atob(
                token.split(".")[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/")
            )
        )

        return {
            id: payload.sub,
            email: payload.email,
            organizationId: payload.organizationId,
            role: payload.role
        }
    } catch {
        return null
    }
}