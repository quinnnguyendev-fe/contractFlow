import { AppShell } from "@/components/layout/app-shell";
import { ContractsTable } from "@/features/contracts/components/contracts-table";
import { mockContracts } from "@/features/contracts/lib/mock-contracts";

export default function ContractsPage() {
  return (
    <AppShell>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>

        <p className="text-muted-foreground">
          Manage and track your organization&apos;s contracts.
        </p>
      </div>

      <ContractsTable contracts={mockContracts} />
    </AppShell>
  );
}
