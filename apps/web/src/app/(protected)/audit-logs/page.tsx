"use client";

import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLog } from "@/lib/api/audit-logs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ACTIONS = [
  "CONTRACT_CREATED",
  "CONTRACT_UPDATED",
  "CONTRACT_STATUS_CHANGED",
  "CONTRACT_ARCHIVED",
  "APPROVAL_CREATED",
  "APPROVAL_STATUS_CHANGED",
];

const ENTITY_TYPES = ["CONTRACT", "APPROVAL"];

function getActionLabel(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getActionBadgeClass(action: string) {
  switch (action) {
    case "CONTRACT_CREATED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "CONTRACT_STATUS_CHANGED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "APPROVAL_CREATED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "APPROVAL_STATUS_CHANGED":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadAuditLogs() {
    try {
      setLoading(true);
      setError(null);

      const response = await getAuditLogs({
        action: action || undefined,
        entityType: entityType || undefined,
        sortOrder,
        page,
        limit: 10,
      });

      setLogs(response.data);
      setTotalPages(response.meta.totalPages);
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, [action, entityType, sortOrder, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="mt-1 text-muted-foreground">
          Track important changes and actions across your organization.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="audit-action" className="text-sm font-medium">
              Action
            </label>

            <select
              id="audit-action"
              value={action}
              onChange={(e) => (setAction(e.target.value), setPage(1))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="">All options</option>

              {ACTIONS.map((item) => (
                <option key={item} value={item}>
                  {getActionLabel(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-2">
            <label htmlFor="audit-entity" className="text-sm font-medium">
              Entity
            </label>
            <select
              id="audit-entity"
              value={entityType}
              onChange={(e) => (setEntityType(e.target.value), setPage(1))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="">All entities</option>
              {ENTITY_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-2">
            <label htmlFor="audit-sort" className="text-sm font-medium">
              Sort
            </label>
            <select
              id="audit-sort"
              value={sortOrder}
              onChange={(event) => (
                setSortOrder(event.target.value as "asc" | "desc"),
                setPage(1)
              )}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setAction("");
              setEntityType("");
              setSortOrder("desc");
              setPage(1);
            }}
            className="h-9 rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            RESET
          </button>
        </div>
      </div>

      {loading && (
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/40 px-4 py-3">
            <div className="h-4 w-34 animate-pulse rounded bg-muted" />
          </div>

          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-center gap-4 px-4 py-4">
                <div className="h-5 w-36 animate-pulse rounded bg-muted" />
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="ml-auto h-8 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
          <div className="space-y-1">
            <p className="font-medium text-destructive">
              Unable to load audit logs.
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>

          <button
            type="button"
            onClick={loadAuditLogs}
            className="mt-4 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-left font-medium">Entity</th>
                  <th className="px-4 py-3 text-left font-medium">Entity ID</th>
                  <th className="px-4 py-3 text-left font-medium">Actor</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-b-0">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getActionBadgeClass(log.action)}`}
                      >
                        {getActionLabel(log.action)}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                        {log.entityType}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className="block max-w-[280px] truncate font-mono text-xs text-muted-foreground"
                        title={log.entityId}
                      >
                        {log.entityId}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className="block max-w-[280px] truncate font-mono text-xs text-muted-foreground"
                        title={log.actorId}
                      >
                        {log.actorId}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="space-y-1">
                        <p className="font-medium">No audit logs found</p>
                        <p className="text-sm text-muted-foreground">
                          Try changing your filters or check back later.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={selectedLog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLog(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Action</p>
                  <p className="mt-1 font-medium">
                    {getActionLabel(selectedLog.action)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Entity</p>
                  <p className="mt-1 font-medium">{selectedLog.entityType}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Entity ID</p>
                  <p className="mt-1 break-all font-mono text-xs">
                    {selectedLog.entityId}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Actor ID</p>
                  <p className="mt-1 break-all font-mono text-xs">
                    {selectedLog.actorId}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">Metadata</p>

                <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/40 p-4 font-mono text-xs leading-5">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Date</p>
                <p className="mt-1">{formatDate(selectedLog.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
