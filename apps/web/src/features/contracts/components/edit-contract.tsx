"use client"
import { useSyncExternalStore } from "react"
import { getServerSnapshot, getSnapshot, subscribe } from "../lib/contracts-store"
import { ContractForm } from "./contract-form"

interface EditContractProps {
    contractId: string
}

export function EditContract({contractId}: EditContractProps) {
    const contractsJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    const contracts = JSON.parse(contractsJson)

    const contract = contracts.find((item: {id: string}) => item.id === contractId)

    if(!contract) return <p>Contract not found.</p>

    const initialValues = {
        contractNumber: contract.contractNumber,
        title: contract.title,
        counterparty: contract.counterparty,
        contractType: contract.contractType,
        status: contract.status,
        value: contract.value,
        currency: contract.currency,
        startDate: contract.startDate,
        endDate: contract.endDate
    }

    return (
        <ContractForm mode="edit" contractId={contractId} initialValues={initialValues}/>
    )
}