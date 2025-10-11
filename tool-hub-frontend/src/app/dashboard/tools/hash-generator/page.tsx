import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { HashGeneratorTool } from "@/components/tools/hash-generator-tool"

export default function HashGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <HashGeneratorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
