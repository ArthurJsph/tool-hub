import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PasswordGeneratorTool } from "@/components/tools/password-generator-tool"

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <PasswordGeneratorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
