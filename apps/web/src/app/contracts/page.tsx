import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractsTable } from "@/features/contracts/components/contracts-table";
import { mockContracts } from "@/features/contracts/lib/mock-contracts";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "expired":
      return "outline";
    case "terminated":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ContractsPage() {
  return (
    <AppShell>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>

        <p className="text-muted-foreground">
          Manage and track your own organization's contracts.
        </p>
      </div>

      <ContractsTable contracts={mockContracts} />

      {/* <Card className="mt-4">
        <CardHeader>
          <CardTitle>All contracts</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b text-left">
                  <th className="h-12 px-4 font-medium">Contract</th>
                  <th className="h-12 px-4 font-medium">Counterparty</th>
                  <th className="h-12 px-4 font-medium">Status</th>
                  <th className="h-12 px-4 text-right font-medium">
                    Contract Value
                  </th>
                  <th className="h-12 px-4 font-medium">Start Date</th>
                  <th className="h-12 px-4 font-medium">End Date</th>
                </tr>
              </thead>

              <tbody className="[&_tr:last-child]:border-0">
                {mockContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium">{contract.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {contract.contractNumber}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">{contract.counterparty}</td>

                    <td className="p-4">
                      <Badge variant={getStatusVariant(contract.status)}>
                        {contract.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right font-medium">
                      {formatCurrency(contract.value, contract.currency)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatDate(contract.startDate)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatDate(contract.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}
    </AppShell>
  );
}
