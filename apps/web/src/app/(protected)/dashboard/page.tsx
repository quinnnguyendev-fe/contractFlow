import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { ArrowUpRight, FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your contracts and track approval progress.
          </p>
        </div>

        <Link
          href="/contracts"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FilePlus2 className="size-4" />
          View contracts.
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <DashboardContent />
    </div>
  );
}
