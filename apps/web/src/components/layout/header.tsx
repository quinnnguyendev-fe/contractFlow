import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div>
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle/>
                <button
                    type="button"
                    aria-label="Search"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Search className="size-5" />
                </button>
                <button
                    type="button"
                    aria-label="Notifications"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Bell className="size-5" />
                </button>
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    Q
                </div>
            </div>
        </header>
    )
}