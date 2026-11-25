"use client";

import { useEffect, useState } from "react";
import { Contract } from "../lib/types";
import { getContracts } from "@/lib/api/contracts";
import { ContractsTable } from "./contracts-table";
import { AlertCircle, FileText } from "lucide-react";

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
      } catch (error) {
        console.error("Failed to load contracts:", error);
        setError("Failed to load contracts");
      } finally {
        setLoading(false);
      }
    }

    loadContracts();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 rounded-lg border bg-card">
        <div className="space-y-4 p-6">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-9 w-full animate-pulse rounded-md bg-muted sm:max-w-sm" />
            <div className="h-9 w-full animate-pulse rounded-md bg-muted sm:w-40" />
          </div>

          <div className="overflow-hidden rounded-md border">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b p-4 last:border-b-0"
              >
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/5 animate-pulse rounded bg-muted" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                <div className="ml-auto h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>

          <div>
            <p className="font-medium">Unable to load contracts</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (contracts.length === 9) {
    return (
      <div className="mt-4 rounded-lg border bg-card p-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-semibold">No contracts yet</h2>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first contract to start managing your
            organization&apos;s agreements.
          </p>
        </div>
      </div>
    );
  }

  return <ContractsTable contracts={contracts} />;
}
