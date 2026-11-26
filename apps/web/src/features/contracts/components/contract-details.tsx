"use client";
import { useEffect, useState } from "react";
import { Contract } from "../lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../lib/contract-formatters";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  archiveContract,
  getContract,
  updateContractStatus,
} from "@/lib/api/contracts";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CalendarDays,
  FileText,
  Pencil,
  User,
} from "lucide-react";

interface ContractDetailsProps {
  id: string;
}

type StatusAction =
  | "PENDING"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED"
  | "ARCHIVED";

function getStatusStyle(status: Contract["status"]) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
      };
    case "draft":
      return {
        label: "Draft",
        className:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
      };
    case "pending":
      return {
        label: "Pending",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
      };
    case "expired":
      return {
        label: "Expired",
        className:
          "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
      };
    case "terminated":
      return {
        label: "Terminated",
        className:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
      };
    case "archived":
      return {
        label: "Archived",
        className:
          "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
      };
    default:
      return {
        label: status,
        className: "",
      };
  }
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function ContractDetails({ id }: ContractDetailsProps) {
  const router = useRouter();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContract() {
      try {
        setLoading(true);
        setError(null);

        const data = await getContract(id);
        setContract(data);
      } catch (error) {
        console.error("Failed to load contract:", error);
        setError("Failed to load contract.");
      } finally {
        setLoading(false);
      }
    }

    loadContract();
  }, [id]);

  async function handleStatusChange(status: StatusAction) {
    try {
      setIsUpdatingStatus(true);
      setStatusError(null);

      const updatedContract = await updateContractStatus(id, status);
      setContract(updatedContract);
    } catch (error) {
      console.error("Failed to update contract status:", error);

      if (error instanceof Error) {
        setStatusError(error.message);
      } else {
        setStatusError("Failed to update contract status.");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleArchive() {
    try {
      setIsDeleting(true);
      setArchiveError(null);

      await archiveContract(id);

      router.push("/contracts");
      router.refresh();
    } catch (error) {
      console.error("Fail to archive contract:", error);

      if (error instanceof Error) {
        setArchiveError(error.message);
      } else {
        setArchiveError("Failed to archive contract.");
      }

      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-8 w-72 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>

        <Card>
          <CardHeader>
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>

          <div>
            <h1 className="text-xl font-semibold">Contract not found</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {error ?? "The requested contract could not be found."}
            </p>
          </div>

          <Link href="/contracts">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to contracts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = getStatusStyle(contract.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/contracts"
          className="inline-flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Contracts
        </Link>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {contract.contractNumber}
            </p>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {contract.title}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {contract.counterparty}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/contracts/${contract.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 size-4" />
              Edit Contract
            </Button>
          </Link>
          {["active", "expired", "terminated"].includes(contract.status) && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="outline">
                    <Archive className="mr-2 size-4" />
                    Archive
                  </Button>
                }
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive this contract?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will come <strong>{contract.title}</strong> to the
                    Archived status. The contract will no longer appear in the
                    active contract workflow.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchive}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Archiving..." : "Archive Contract"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {archiveError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {archiveError}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            General Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Contract Number" value={contract.contractNumber} />

          <DetailItem label="Contract Title" value={contract.title} />

          <DetailItem label="Counterparty" value={contract.counterparty} />

          <DetailItem label="Contract Type" value={contract.contractType} />

          <DetailItem
            label="Status"
            value={
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            Contract Period
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Start Date" value={contract.startDate} />
          <DetailItem label="End Date" value={contract.endDate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Audit Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <DetailItem
            label="Created At"
            value={formatDate(contract.createdAt)}
          />

          <DetailItem
            label="Updated At"
            value={formatDate(contract.updatedAt)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {contract.status === "draft" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("PENDING")}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "Submit for Approval"}
              </Button>
            )}

            {contract.status === "pending" && (
              <Button
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Activating..." : "Activate Contract"}
              </Button>
            )}

            {contract.status === "active" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("EXPIRED")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Mark as Expired"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("TERMINATED")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Terminate Contract"}
                </Button>
              </>
            )}
          </div>

          {statusError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {statusError}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
