import { AppShell } from "@/components/layout/app-shell";

export default function UsersPage() {
    return (
        <AppShell>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="mt-2 text-muted-foreground">
                Manage organization members and access.
            </p>
        </AppShell>
    )
}