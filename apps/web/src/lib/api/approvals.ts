import { apiClient } from "./client";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type Approval = {
  id: string;
  contractId: string;
  approverId: string;
  status: ApprovalStatus;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateApprovalPayload = {
  approverId: string;
};

export type UpdateApprovalPayload = {
  status: "APPROVED" | "REJECTED";
  comment?: string;
};

export async function getContractApprovals(
  contractId: string,
): Promise<Approval[]> {
  return apiClient<Approval[]>(`/contracts/${contractId}/approvals`);
}

export async function createApproval(
  contractId: string,
  payload: CreateApprovalPayload,
): Promise<Approval> {
  return apiClient<Approval>(`/contracts/${contractId}/approvals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateApproval(
  contractId: string,
  approvalId: string,
  payload: UpdateApprovalPayload,
): Promise<Approval> {
  return apiClient<Approval>(
    `/contracts/${contractId}/approvals/${approvalId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
