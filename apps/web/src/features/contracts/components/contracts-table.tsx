"use client";
import { useMemo, useState } from "react";
import { Contract, ContractStatus } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface ContractsTableProps {
  contracts: Contract[];
}

const PAGE_SIZE = 5;

const statusOptions: { label: string; value: ContractStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Terminated", value: "terminated" },
  { label: "Archived", value: "archived" },
];

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("en-US")} ${currency}`;
  }
}

function formatDate(date: string) {
  const parseDate = new Date(date);

  if (Number.isNaN(parseDate.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDate);
}

function getStatusStyle(status: ContractStatus) {
  const styles: Record<ContractStatus, { label: string; className: string }> = {
    draft: {
      label: "Draft",
      className:
        "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
    pending: {
      label: "Pending",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
    },
    active: {
      label: "Active",
      className:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400",
    },
    expired: {
      label: "Expired",
      className:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400",
    },
    terminated: {
      label: "Terminated",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
    },
    archived: {
      label: "Archived",
      className:
        "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  return styles[status];
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">(
    "all",
  );

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
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredContracts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredContracts, safeCurrentPage]);

  const startResult =
    filteredContracts.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;

  const endResult = Math.min(
    safeCurrentPage * PAGE_SIZE,
    filteredContracts.length,
  );

  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader className="gap-4 border-b bg-muted/20 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">All Contracts</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Search, filter and manage your organization&apos;s contracts.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit">
            {contracts.length} total
          </Badge>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search contracts"
              className="pl-9"
            />
          </div>

          <div className="relative sm:w-48">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as ContractStatus | "all");
                setCurrentPage(1);
              }}
              aria-label="Filter contracts by status"
              className="h-9 w-full appearance-none rounded-md border border-input bg-background py-1 pl-9 pr-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between px-5 pt-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startResult}–{endResult}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredContracts.length}
            </span>{" "}
            contracts
          </p>

          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted/40">
              <tr className="border-y text-left">
                <th className="h-12 px-5 font-medium text-muted-foreground sm:px-6">
                  Contract
                </th>
                <th className="h-12 px-4 font-medium text-muted-foreground">
                  Counterparty
                </th>
                <th className="h-12 px-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-right font-medium text-muted-foreground">
                  Contract Value
                </th>
                <th className="h-12 px-4 font-medium text-muted-foreground">
                  Start Date
                </th>
                <th className="h-12 px-5 font-medium text-muted-foreground sm:px-6">
                  End Date
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedContracts.length > 0 ? (
                paginatedContracts.map((contract) => {
                  const statusStyle = getStatusStyle(contract.status);

                  return (
                    <tr
                      key={contract.id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="max-w-64 p-4 pl-5 sm:pl-6">
                        <div className="space-y-1">
                          <Link
                            href={`/contracts/${contract.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {contract.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {contract.contractNumber}
                          </p>
                        </div>
                      </td>

                      <td className="max-w-48 truncate p-4">
                        {contract.counterparty}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={statusStyle.className}
                        >
                          {statusStyle.label}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap p-4 text-right font-medium tabular-nums">
                        {formatCurrency(contract.value, contract.currency)}
                      </td>

                      <td className="whitespace-nowrap p-4 text-muted-foreground">
                        {formatDate(contract.startDate)}
                      </td>

                      <td className="whitespace-nowrap p-4 pr-5 text-muted-foreground sm:pr-6">
                        {formatDate(contract.endDate)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="size-6 text-muted-foreground" />
                      </div>

                      <p className="mt-4 font-medium">No contracts found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try changing your search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted-foreground">
            Page {safeCurrentPage} of {Math.max(totalPages, 1)}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safeCurrentPage >= totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
