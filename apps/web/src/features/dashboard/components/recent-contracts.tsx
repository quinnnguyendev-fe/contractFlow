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

function StatusBadge({ status }: { status: Contract["status"] }) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );

    case "pending":
      return <Badge variant="secondary">Pending</Badge>;

    case "draft":
      return <Badge variant="outline">Draft</Badge>;

    case "expired":
      return <Badge variant="outline">Expired</Badge>;

    case "terminated":
      return <Badge variant="destructive">Terminated</Badge>;

    case "archived":
      return <Badge variant="outline">Archived</Badge>;

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function RecentContract() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentContracts() {
      try {
        const data = await getContracts();

        const recentContracts = [...data]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, 5);

        setContracts(recentContracts);
      } catch (error) {
        console.error("Failed to load recent contracts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentContracts();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Contracts</CardTitle>
          <CardDescription>
            An overview of recently updated contracts.
          </CardDescription>
        </div>

        <Link
          href="/contracts"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contracts</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Loading contracts...
                </TableCell>
              </TableRow>
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No contracts found.
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <Link
                      href={`/contracts/${contract.id}`}
                      className="block hover:underline"
                    >
                      <p className="font-medium">{contract.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.contractNumber}
                      </p>
                    </Link>
                  </TableCell>

                  <TableCell>{contract.counterparty}</TableCell>

                  <TableCell>
                    <StatusBadge status={contract.status} />
                  </TableCell>

                  <TableCell>{formatDate(contract.endDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
