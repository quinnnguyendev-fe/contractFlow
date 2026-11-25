"use client";
import { getContracts } from "@/lib/api/contracts";
import { CalendarClock, CheckCircle2, Clock3, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ContractStatsData = {
  total: number;
  active: number;
  pending: number;
  expiringSoon: number;
};

const initialStats: ContractStatsData = {
  total: 0,
  active: 0,
  pending: 0,
  expiringSoon: 0,
};
export function ContractStats() {
  const [stats, setStats] = useState<ContractStatsData>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const contracts = await getContracts();
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

            return endDate >= now && endDate <= thirtyDaysFromNow;
          }).length,
        });
      } catch (error) {
        console.error("Failed to load contract stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statItems = [
    {
      title: "Total Contracts",
      value: stats.total,
      description: "All contracts in your organization",
      icon: FileText,
    },
    {
      title: "Active Contracts",
      value: stats.active,
      description: "Currently active",
      icon: CheckCircle2,
    },
    {
      title: "Pending Reviews",
      value: stats.pending,
      description: "Awaiting approval",
      icon: Clock3,
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      description: "Within the next 30 days",
      icon: CalendarClock,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "-" : stat.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
