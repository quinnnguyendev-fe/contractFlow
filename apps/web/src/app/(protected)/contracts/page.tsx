import { Button } from "@/components/ui/button";
import { ContractsList } from "@/features/contracts/components/contracts-list";
import Link from "next/link";

export default function ContractsPage() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>

        <p className="text-muted-foreground">
          Manage and track your organization&apos;s contracts.
        </p>
      </div>

      <div className="mt-2">
        <Link href="/contracts/new">
          <Button>Create Contract</Button>
        </Link>
      </div>

      {/* <ContractsTable contracts={mockContracts} /> */}
      <ContractsList />
    </>
  );
}
