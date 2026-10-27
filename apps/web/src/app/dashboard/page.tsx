import { ContractStats } from "@/components/contract-stats";
import { AppShell } from "@/components/layout/app-shell";
import { RecentContract } from "@/features/dashboard/components/recent-contracts";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Manage your contracts and track approval progress.
          </p>
        </div>

        <ContractStats />
        <RecentContract />
      </div>
    </AppShell>
  );
}
