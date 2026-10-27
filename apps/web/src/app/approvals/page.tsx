import { AppShell } from "@/components/layout/app-shell";

export default function ApprovalsPage() {
    return (
        <AppShell>
            <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
            <p className="mt-2 text-muted-foreground">
                Review and manage contracts approval requests.
            </p>
        </AppShell>
    )
}