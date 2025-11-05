import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebarResponsive } from "@/components/dashboard-sidebar-responsive"
import { HashGeneratorTool } from "@/components/tools/hash-generator-tool"

export default function HashGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64">
          <DashboardSidebarResponsive className="md:h-screen md:sticky md:top-0" />
        </div>
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <HashGeneratorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
