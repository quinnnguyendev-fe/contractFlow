"use client";
import { getContracts } from "@/lib/api/contracts";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type ContractStatsData = {
  total: number;
  active: number;
  pending: number;
  expiringSoon: number;
};

type ContractStatsProps = {
  stats: ContractStatsData;
  loading: boolean;
  error: boolean;
};

const statItems = [
  {
    key: "total",
    title: "Total Contracts",
    description: "All contracts in your organization",
    icon: FileText,
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    key: "active",
    title: "Active Contracts",
    description: "Currently active",
    icon: CheckCircle2,
    iconClass:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    key: "pending",
    title: "Pending Reviews",
    description: "Awaiting approval",
    icon: Clock3,
    iconClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    key: "expiringSoon",
    title: "Expiring Soon",
    description: "Within the next 30 days",
    icon: CalendarClock,
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
] as const;

export function ContractStats({ stats, loading, error }: ContractStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.key} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${stat.iconClass}`}
              >
                <Icon className="size-5" />
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              ) : error ? (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" />
                  Unavailable
                </div>
              ) : (
                <div className="text-3xl font-bold tracking-tight tabular-nums">
                  {stats[stat.key].toLocaleString()}
                </div>
              )}

              <p className="mt-2 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
