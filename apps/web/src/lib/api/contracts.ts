import { Contract, ContractStatus } from "@/features/contracts/lib/types";
import { apiClient } from "./client";

type ContractStatusApi =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED"
  | "ACHIVED";

type ApiContract = {
  id: string;
  organizationId: string;
  contractNumber: string;
  title: string;
  counterparty: string;
  counterType: string;
  status: ContractStatusApi;
  value: string;
  currency: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

type ContractListResponse = {
  data: ApiContract[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateContractPayload = {
  contractNumber: string;
  title: string;
  counterparty: string;
  contractType: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
};

export type UpdateContractPayload = {
  title?: string;
  counterparty?: string;
  contractType?: string;
  value?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
};

function mapStatus(status: ContractStatusApi): ContractStatus {
  return status.toLowerCase() as ContractStatus;
}

function mapContract(contract: ApiContract): Contract {
  return {
    id: contract.id,
    contractNumber: contract.contractNumber,
    title: contract.title,
    counterparty: contract.counterparty,
    contractType: contract.counterType,
    status: mapStatus(contract.status),
    value: Number(contract.value),
    currency: contract.currency,
    startDate: contract.startDate,
    endDate: contract.endDate,
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
  };
}

export async function getContracts(): Promise<Contract[]> {
  const response = await apiClient<ContractListResponse>('/contracts');

  return response.data.map(mapContract);
}

export async function getContract(id: string): Promise<Contract> {
  const contract = await apiClient<ApiContract>(`/contracts/${id}`);

  return mapContract(contract);
}

export async function createContract(
  payload: CreateContractPayload,
): Promise<Contract> {
  const contract = await apiClient<ApiContract>('/contracts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapContract(contract);
}

export async function updateContract(
  id: string,
  payload: UpdateContractPayload,
): Promise<Contract> {
  const contract = await apiClient<ApiContract>(`/contracts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return mapContract(contract);
}

export async function archiveContract(id: string): Promise<Contract> {
  const contract = await apiClient<ApiContract>(`/contracts/${id}`, {
    method: 'DELETE',
  });

  return mapContract(contract);
}
