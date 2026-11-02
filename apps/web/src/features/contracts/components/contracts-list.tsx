"use client"
import { useSyncExternalStore } from "react";
import { ContractsTable } from "./contracts-table";
import { getServerSnapshot, getSnapshot, subscribe } from "../lib/contracts-store";
export function ContractsList() {
  const contractsJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const contracts = JSON.parse(contractsJson)

  return <ContractsTable contracts={contracts} />
}
