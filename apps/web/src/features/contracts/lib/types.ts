export type ContractStatus = "draft" | "pending" | "active" | "expired" | "terminated"

export interface Contract {
    id: string;
    contractNumber: string;
    title: string;
    counterparty: string;
    contractType: string;
    status: ContractStatus;
    value: number;
    currency: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}