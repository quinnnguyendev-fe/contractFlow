"use client";

import { useEffect, useState } from "react";
import { getContract } from "@/lib/api/contracts";
import { ContractForm } from "./contract-form";
import type { CreateContractInput } from "../lib/types";

interface EditContractProps {
  contractId: string;
}

export function EditContract({ contractId }: EditContractProps) {
  const [initialValues, setInitialValues] =
    useState<CreateContractInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContract() {
      try {
        setLoading(true);
        setError(null);

        const contract = await getContract(contractId);

        setInitialValues({
          contractNumber: contract.contractNumber,
          title: contract.title,
          counterparty: contract.counterparty,
          contractType: contract.contractType,
          value: Number(contract.value),
          currency: contract.currency,
          startDate: contract.startDate.slice(0, 10),
          endDate: contract.endDate.slice(0, 10),
        });
      } catch {
        setError("Failed to load contract.");
      } finally {
        setLoading(false);
      }
    }

    loadContract();
  }, [contractId]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading contract...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!initialValues) {
    return <p>Contract not found.</p>;
  }

  return (
    <ContractForm
      mode="edit"
      contractId={contractId}
      initialValues={initialValues}
    />
  );
}
