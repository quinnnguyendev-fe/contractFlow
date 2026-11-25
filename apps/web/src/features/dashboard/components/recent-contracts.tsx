"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Contract } from "@/features/contracts/lib/types";
import { getContracts } from "@/lib/api/contracts";
import { formatDate } from "@/features/contracts/lib/contract-formatters";
import { AlertCircle, ArrowRight, FileText } from "lucide-react";


type RecentContractProps = {
  contracts: Contract[];
  loading: boolean;
  error: boolean;
};
function StatusBadge({ status }: { status: Contract["status"] }) {
  const variants: Record<
    Contract["status"],
    { label: string; className: string }
  > = {
    active: {
      label: "Active",
      className:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400",
    },
    pending: {
      label: "Pending",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400",
    },
    draft: {
      label: "Draft",
      className: "",
    },
    expired: {
      label: "Expired",
      className:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-400",
    },
    terminated: {
      label: "Terminated",
      className: "",
    },
    archived: {
      label: "Archived",
      className: "",
    },
  };
  const variant = variants[status];

  return (
    <Badge
      variant={
        status === "terminated"
          ? "destructive"
          : status === "draft" || status === "archived"
            ? "outline"
            : "secondary"
      }
      className={variant.className}
    >
      {variant.label}
    </Badge>
  );
}
function ContractSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 4 }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <div className="h-4 w-full max-w-32 animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function RecentContract({
  contracts,
  loading,
  error,
}: RecentContractProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Recent Contracts</CardTitle>
          <CardDescription>
            An overview of recently updated contracts.
          </CardDescription>
        </div>

        <Link
          href="/contracts"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-48">Contracts</TableHead>
                <TableHead className="min-w-36">Counterparty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="whitespace-nowrap">End Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <ContractSkeleton />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="size-5" />
                      Failed to load recent contracts.
                    </div>
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12">
                    <div className="flex flex-col gap-3 items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="size-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">No contracts yet.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Create your first contract to get started.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow
                    key={contract.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="block min-w-0"
                      >
                        <p className="truncate font-medium hover:text-primary hover:underline">
                          {contract.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {contract.contractNumber}
                        </p>
                      </Link>
                    </TableCell>

                    <TableCell className="max-w-48 truncate">
                      {contract.counterparty}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(contract.endDate)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
