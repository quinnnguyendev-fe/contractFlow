import { AppShell } from "@/components/layout/app-shell";

export default function ContractsPage() {
  return (
    <AppShell>
        <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>

            <p className="text-muted-foreground">
                Manage and track your own organization's contracts.
            </p>
        </div>
    </AppShell>
  )
}
