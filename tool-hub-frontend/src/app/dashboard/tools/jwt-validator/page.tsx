import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebarResponsive } from "@/components/dashboard-sidebar-responsive"
import { JwtValidatorTool } from "@/components/tools/jwt-validator-tool"

export default function JWTValidatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64">
          <DashboardSidebarResponsive className="md:h-screen md:sticky md:top-0" />
        </div>
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <JwtValidatorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
