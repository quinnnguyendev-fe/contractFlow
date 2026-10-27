import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const contracts = [
  {
    id: "CRT-001",
    name: "Software License Agreement",
    counterparty: "Acme Inc.",
    status: "Active",
    endDate: "Dec 31, 2026",
  },
  {
    id: "CRT-002",
    name: "Service Agreement",
    counterparty: "Globex Corp.",
    status: "In Review",
    endDate: "Nov 15, 2026",
  },
  {
    id: "CRT-003",
    name: "Data Processing Agreement",
    counterparty: "Initech Ltd.",
    status: "Draft",
    endDate: "Jan 20, 2027",
  },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    case "In Review":
      return <Badge variant="secondary">In Review</Badge>;
    case "Draft":
      return <Badge variant="outline">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
export function RecentContract() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Contracts</CardTitle>
          <CardDescription>
            An overview of recently updated contracts.
          </CardDescription>
        </div>
        <Link href="/contracts" className="text-sm font-medium text-primary hover:underline">
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
                {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                        <TableCell>
                            <div>
                                <p className="font-medium">{contract.name}</p>
                                <p className="text-xs text-muted-foreground">{contract.id}</p>
                            </div>
                        </TableCell>

                        <TableCell>{contract.counterparty}</TableCell>

                        <TableCell>
                            <StatusBadge status={contract.status} />
                        </TableCell>

                        <TableCell>{contract.endDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
