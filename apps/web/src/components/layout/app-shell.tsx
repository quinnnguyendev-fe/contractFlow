import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

type AppShellProps = {
    children: ReactNode
}
export function AppShell({children}: AppShellProps) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <Sidebar/>
            <div className="flex min-w-0 flex-1 flex-col">
                <Header/>
                <main className="min-w-0 flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}