import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UuidGeneratorTool } from "@/components/tools/uuid-generator-tool"

export default function UUIDGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1">
            <UuidGeneratorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
