import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts } from "@/features/contracts/lib/mock-contracts";
import { notFound } from "next/navigation";

interface ContractDetailsPageProps {
  params: Promise<{ id: string }>;
}

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
  }).format(new Date(`${date.slice(0, 10)}T00:00:00Z`));
}

function getStatusVariant(
  status: "draft" | "pending" | "active" | "expired" | "terminated",
) {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "expired":
    case "terminated":
      return "destructive";
    default:
      return "outline";
  }
}

export default async function ContractDetailsPage({
  params,
}: ContractDetailsPageProps) {
  const { id } = await params;

  const contract = mockContracts.find((item) => item.id === id);

  if (!contract) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Contracts / {contract.contractNumber}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {contract.title}
              </h1>
              <p className="text-muted-foreground">{contract.contractNumber}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract Number</p>
              <p className="font-medium">{contract.contractNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract Title</p>
              <p className="font-medium">{contract.title}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Counterparty</p>
              <p className="font-medium">{contract.counterparty}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusVariant(contract.status)}>
                {contract.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract Value</p>
              <p className="text-xl font-semibold">
                {formatCurrency(contract.value, contract.currency)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="font-medium">{contract.currency}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Period</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(contract.startDate)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{formatDate(contract.endDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(contract.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{formatDate(contract.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
