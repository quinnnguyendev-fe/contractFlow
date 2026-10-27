import { CalendarClock, CheckCircle2, Clock3, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


const stats = [
    {
        title: "Total Contracts",
        value: "128",
        description: "All contracts in your organization",
        icon: FileText,
    },
    {
        title: "Active Contracts",
        value: "84",
        description: "Currently active",
        icon: CheckCircle2,
    },
    {
        title: "Pending Reviews",
        value: "12",
        description: "Awaiting approval",
        icon: Clock3,
    },
    {
        title: "Expiring Soon",
        value: "7",
        description: "Within the next 30 days",
        icon: CalendarClock,
    }
]
export function ContractStats() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                                <Icon className="size-4 text-muted-foreground"/>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}