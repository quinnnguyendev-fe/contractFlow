"use client";

import { useEffect, useState } from "react";
import { getContract } from "@/lib/api/contracts";
import { ContractForm } from "./contract-form";
import type { CreateContractInput } from "../lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditContractProps {
  contractId: string;
}

export function EditContract({ contractId }: EditContractProps) {
  const [initialValues, setInitialValues] =
    useState<CreateContractInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContract() {
      try {
        setLoading(true);
        setError(null);

        const contract = await getContract(contractId);

        if (cancelled) return;

        setInitialValues({
          contractNumber: contract.contractNumber,
          title: contract.title,
          counterparty: contract.counterparty,
          contractType: contract.contractType,
          value: Number(contract.value),
          currency: contract.currency,
          startDate: contract.startDate ? contract.startDate.slice(0, 10) : "",
          endDate: contract.endDate ? contract.endDate.slice(0, 10) : "",
        });
      } catch (error) {
        console.error("Failed to load contract:", error);

        if (!cancelled) {
          setError("Unable to load this contract. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContract();
  }, [contractId]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="space-y-3">
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        </CardHeader>

        <CardContent className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>

          <div>
            <h2 className="font-semibold">Unable to load contract</h2>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>

          <Link href={`/contracts/${contractId}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to contract
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contract not found</h2>
        <p className="text-sm text-muted-foreground">
          The request contract could not be found.
        </p>

        <Link href="/contracts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back to contracts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ContractForm
      mode="edit"
      contractId={contractId}
      initialValues={initialValues}
    />
  );
}
