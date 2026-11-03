import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewContractPage() {
    return (
      <AppShell>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Create Contract
            </h1>
            <p className="text-muted-foreground">
              Create a new contract for your organization
            </p>

            <Button variant="outline">
              <Link href="/contracts">Cancel</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
}