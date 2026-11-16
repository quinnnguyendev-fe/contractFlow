"use client"

import { useEffect, useState } from "react";
import { Contract } from "../lib/types";
import { getContracts } from "@/lib/api/contracts";
import { ContractsTable } from "./contracts-table";

export function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContracts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getContracts();
        setContracts(data);
      } catch {
        setError("Failed to load contracts");
      } finally {
        setLoading(false);
      }
    }

    loadContracts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Loading contracts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-destructive">
        {error}
      </div>
    );
  }
  
  return <ContractsTable contracts={contracts} />;
}
