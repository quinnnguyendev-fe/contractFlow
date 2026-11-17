"use client";

import { Contract } from "@/features/contracts/lib/types";
import {
  Approval,
  createApproval,
  getContractApprovals,
  updateApproval,
} from "@/lib/api/approvals";
import { getContracts } from "@/lib/api/contracts";
import { getUsers, User } from "@/lib/api/users";
import { CurrentUser, getCurrentUser } from "@/lib/auth/current-user";
import { useEffect, useState } from "react";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};
export default function ApprovalsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loadingContracts, setLoadingContracts] = useState<boolean>(true);
  const [loadingApprovals, setLoadingApprovals] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedApproverId, setSelectedApproverId] = useState("");
  const [creatingApproval, setCreatingApproval] = useState(false);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadContracts() {
      try {
        const response = await getContracts();

        setContracts(response);

        if (response.length > 0) {
          setSelectedContractId(response[0].id);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load contracts",
        );
      } finally {
        setLoadingContracts(false);
      }
    }

    loadContracts();

    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users.");
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedContractId) {
      setApprovals([]);
      return;
    }

    async function loadContracts() {
      setLoadingApprovals(true);
      setError("");

      try {
        const data = await getContractApprovals(selectedContractId);
        setApprovals(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load approvals",
        );
      } finally {
        setLoadingApprovals(false);
      }
    }

    loadContracts();
  }, [selectedContractId]);

  const selectedContract = contracts.find((contract) => {
    contract.id === selectedContractId;
  });

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage contracts approval requests.
        </p>
      </div>

      <div className="rouned-lg border bg-card p-4">
        <label htmlFor="contract" className="mb-2 block text-sm font-medium">
          Contract
        </label>

        <select>
          {loadingContracts ? (
            <option>Loading contracts...</option>
          ) : contracts.length === 0 ? (
            <option>No contracts available</option>
          ) : (
            contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.contractNumber} - {contract.title}
              </option>
            ))
          )}
        </select>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        ""
      )}

      {selectedContract && (
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                {selectedContract.contractNumber}
              </span>
              <h2 className="font-semibold">{selectedContract.title}</h2>
              <span className="text-sm text-muted-foreground">
                Status:{selectedContract.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-4">
            {loadingApprovals ? (
              <p className="text-sm text-muted-foreground">
                Loading approvals...
              </p>
            ) : approvals.length === 0 ? (
              <div className="rounded-md border border-dash p-8 text-center">
                <p className="font-medium">No approvals</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This contract does not have any approval requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <div key={approval.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-medium">Approver</p>
                        <p className="text-sm text-muted-foreground">
                          {approval.approverId}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[approval.status] ?? "bg-gray-100 text-gray-800"}`}
                      >
                        {approval.status}
                      </span>
                    </div>

                    {approval.comment && (
                      <div className="mt-4 rounded-md bg-muted/50 p-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          Comment
                        </p>
                        <p className="mt-1 text-sm">{approval.comment}</p>
                      </div>
                    )}

                    {approval.status === "PENDING" &&
                      approval.approverId === currentUser?.id && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          <textarea
                            id={`comment-${approval.id}`}
                            placeholder="Add a comment..."
                            className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                              onClick={async () => {
                                const textarea = document.getElementById(
                                  `comment-${approval.id}`,
                                ) as HTMLTextAreaElement | null;

                                try {
                                  setError("");
                                  await updateApproval(
                                    selectedContractId,
                                    approval.id,
                                    {
                                      status: "APPROVED",
                                      comment: textarea?.value || undefined,
                                    },
                                  );

                                  const data =
                                    await getContractApprovals(
                                      selectedContractId,
                                    );
                                  setApprovals(data);
                                } catch (error) {
                                  setError(
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to approve request",
                                  );
                                }
                              }}
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive"
                              onClick={async () => {
                                const textarea = document.getElementById(
                                  `comment-${approval.id}`,
                                ) as HTMLTextAreaElement | null;

                                try {
                                  setError("");
                                  await updateApproval(
                                    selectedContractId,
                                    approval.id,
                                    {
                                      status: "REJECTED",
                                      comment: textarea?.value || undefined,
                                    },
                                  );

                                  const data =
                                    await getContractApprovals(
                                      selectedContractId,
                                    );
                                  setApprovals(data);
                                } catch (error) {
                                  setError(
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to reject request",
                                  );
                                }
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                    <p className="mt-3 text-xs text-muted-foreground">
                      Update {new Date(approval.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedContract &&
        selectedContract.status === "pending" &&
        (currentUser?.role === "OWNER" || currentUser?.role === "ADMIN") && (
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-3">
              <h2 className="font-semibold">Create Approval</h2>
              <p className="text-sm text-muted-foreground">
                Assign an approver to this pending contract.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <label
                  htmlFor="approver"
                  className="mb-2 block text-sm font-medium"
                >
                  Approver
                </label>
                <select
                  id="approver"
                  value={selectedApproverId}
                  onChange={(e) => setSelectedApproverId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select an approver</option>

                  {users
                    .filter((user) => user.id !== selectedContract.id)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email} - {user.role}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!selectedApproverId || creatingApproval}
                onClick={async () => {
                  setCreatingApproval(true);
                  setError("");

                  try {
                    await createApproval(selectedContract.id, {
                      approverId: selectedApproverId,
                    });

                    const data = await getContractApprovals(
                      selectedContract.id,
                    );
                    setApprovals(data);
                    setSelectedApproverId("");
                  } catch (error) {
                    setError(
                      error instanceof Error
                        ? error.message
                        : "Failed to create approval",
                    );
                  } finally {
                    setCreatingApproval(false);
                  }
                }}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingApproval ? "Creating..." : "Create Approval"}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
