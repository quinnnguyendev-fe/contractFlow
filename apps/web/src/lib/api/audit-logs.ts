import { apiClient } from "./client"

export type AuditLog = {
    id: string,
    organizationId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, unknown> | null,
    createdAt: string
}

export type AuditLogResponse = {
    data: AuditLog[],
    meta: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}

export type AuditLogQuery = {
    page?: number,
    limit?: number,
    action?: string,
    entityType?: string,
    entityId?: string,
    sortOrder?: 'asc' | 'desc'
}

export async function getAuditLogs(query: AuditLogQuery = {}): Promise<AuditLogResponse> {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
        if(value !== undefined && value !== '') {
            params.set(key, String(value))
        }
    })

    const queryString = params.toString()

    return apiClient<AuditLogResponse>(`/audit-logs${queryString ? `?${queryString}` : ''}`,)
}

