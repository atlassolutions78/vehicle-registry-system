import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { Header } from "./_components/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-slate-100 dark:bg-zinc-950">
      <AppSidebar />
      <SidebarInset className="md:m-2 md:ml-0 md:rounded-xl md:shadow-sm overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
