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
import { archiveContract, getContract } from "@/lib/api/contracts";

interface ContractDetailsProps {
  id: string;
}

function getStatusVariant(status: Contract["status"]) {
  switch (status) {
    case "active":
      return "default";
    case "draft":
      return "secondary";
    case "pending":
      return "destructive";
    case "terminated":
    case "expired":
      return "ghost";
    default:
      return "default";
  }
}

export function ContractDetails({ id }: ContractDetailsProps) {
  const router = useRouter();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    async function loadContract() {
      try {
        setLoading(true);
        setError(null);

        const data = await getContract(id);
        setContract(data);
      } catch {
        setError("Failed to load contract.");
      } finally {
        setLoading(false);
      }
    }

    loadContract();
  }, [id]);
  
  async function handleDelete() {
    try {
      setIsDeleting(true);

      await archiveContract(id);

      router.push("/contracts");
      router.refresh();
    } catch (err) {
      console.error("Fail to archive contract:", err);
      setIsDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading contract...</p>;
  }

  if (error || !contract) {
    return (
      <div className="space-y-4">
        <h1 className="font-bold text-2xl">Contract Not Found</h1>
        <p className="text-muted-foreground">
          The requested contract could not be found.
        </p>
        <Link
          href="/contracts"
          className="text-primary underline underline-offset-4"
        >
          Back to contracts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Contracts / {contract.contractNumber}
        </p>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {contract.title}
          </h1>
          <p className="text-muted-foreground">{contract.contractNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Contract Number:</p>
            <p className="font-medium">{contract.contractNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Contract Title:</p>
            <p className="font-medium">{contract.title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Counterparty:</p>
            <p className="font-medium">{contract.counterparty}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status:</p>
            <Badge variant={getStatusVariant(contract.status)}>
              {contract.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Contract Type:</p>
            <p className="font-medium">{contract.contractType}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Period</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Start Date:</p>
            <p className="font-medium">{contract.startDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">End Date:</p>
            <p className="font-medium">{contract.endDate}</p>
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

      <div className="flex items-center gap-2">
        <Link href={`/contracts/${contract.id}/edit`}>
          <Button>Edit Contract</Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Delete Contract
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this contract?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete
                <strong> {contract.title}</strong>? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
