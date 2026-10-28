"use client";
import { useMemo, useState } from "react";
import { Contract, ContractStatus } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ContractsTableProps {
  contracts: Contract[];
}

const statusOptions: { label: string; value: ContractStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Terminated", value: "terminated" },
];

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

function getStatusVariant(status: ContractStatus) {
  switch (status) {
    case "draft":
      return "default";
    case "pending":
      return "secondary";
    case "active":
      return "outline";
    case "expired":
      return "ghost";
    case "terminated":
      return "destructive";
    default:
      return "outline";
  }
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">(
    "all",
  );

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredContracts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesSearch = [
        contract.title,
        contract.contractNumber,
        contract.counterparty,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, search, statusFilter]);

  const totalPages = Math.ceil(filteredContracts.length / PAGE_SIZE);

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredContracts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredContracts, currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contracts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by title, contract number, or counterparty..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search contracts"
            className="sm: max-w-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ContractStatus | "all");
              setCurrentPage(1);
            }}
            aria-label="Filter contractsby status"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filteredContracts.length} of {contracts.length} contracts
        </p>

        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b text-left">
                <th className="h-12 px-4 font-medium">Contract</th>
                <th className="h-12 px-4 font-medium">Counterparty</th>
                <th className="h-12 px-4 font-medium">Status</th>
                <th className="h-12 px-4 font-medium text-right">
                  Contract Value
                </th>
                <th className="h-12 px-4 font-medium">Start Date</th>
                <th className="h-12 px-4 font-medium">End Date</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {paginatedContracts.map((contract) => (
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

                  <td className="whitespace-nowrap p-4">
                    {formatDate(contract.startDate)}
                  </td>

                  <td className="whitespace-nowrap p-4">
                    {formatDate(contract.endDate)}
                  </td>
                </tr>
              ))}

              {filteredContracts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
            ``
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
