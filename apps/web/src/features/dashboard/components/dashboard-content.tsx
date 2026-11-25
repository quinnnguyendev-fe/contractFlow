"use client"
import { ContractStats, ContractStatsData } from "@/components/contract-stats";
import { Contract } from "@/features/contracts/lib/types";
import { getContracts } from "@/lib/api/contracts";
import { useEffect, useState } from "react";
import { RecentContract } from "./recent-contracts";


const initialStats: ContractStatsData = {
  total: 0,
  active: 0,
  pending: 0,
  expiringSoon: 0,
};

export function DashboardContent() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ContractStatsData>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(false);

        const data = await getContracts();
        setContracts(data);

        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        setStats({
          total: contracts.length,
          active: contracts.filter((contract) => contract.status === "active")
            .length,
          pending: contracts.filter((contract) => contract.status === "pending")
            .length,
          expiringSoon: contracts.filter((contract) => {
            if (contract.status !== "active") {
              return false;
            }

            const endDate = new Date(contract.endDate);

            return (
              !Number.isNaN(endDate.getTime()) &&
              endDate >= now &&
              endDate <= thirtyDaysFromNow
            );
          }).length,
        });
      } catch (error) {
        console.error("Failed to load contract stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const recentContracts = [...contracts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        A summary of your organization's contract activity.
                    </p>

                    <ContractStats stats={stats} loading={loading} error={error} />
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        Activity
                    </h2>
                    <p className="text-sm text-muted-foreground">Keep track of your latest contract updates.</p>
                </div>

                <RecentContract contracts={recentContracts} loading={loading} error={error}/>
            </section>
        </div>
    )
}
