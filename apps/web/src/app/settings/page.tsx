import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
    return (
        <AppShell>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-muted-foreground">
                Configure your organization and application preferences.
            </p>
        </AppShell>
    )
}