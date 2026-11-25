export type ContractStatus =
  | "draft"
  | "pending"
  | "active"
  | "expired"
  | "terminated"
  | "archived";

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

export type CreateContractInput = {
  contractNumber: string;
  title: string;
  counterparty: string;
  contractType: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
};