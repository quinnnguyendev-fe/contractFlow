import { apiClient } from "./client"

export type UserRole = "ADMIN" | "OWNER" | "MEMBER" | "VIEWER"

export type User = {
    id: string,
    email: string,
    role: UserRole
}

export async function getUsers():Promise<User[]> {
    const users = await apiClient<{
        id: string,
        email: string,
        memberships: {
            role: UserRole,
            organizationId: string
        }[]
    }[]>("/users")

    return users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.memberships[0].role ?? "MEMBER"
    }))
}