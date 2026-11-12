'use client';

import { useEffect, useState } from 'react';
import { getAuditLogs, type AuditLog } from '@/lib/api/audit-logs';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAuditLogs();
        setLogs(response.data);
      } catch {
        setError('Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track important changes and actions across your organization.
        </p>
      </div>

      {loading && (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Loading audit logs...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 p-6 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Entity ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Actor
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-4 font-medium whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {log.entityType}
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
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}