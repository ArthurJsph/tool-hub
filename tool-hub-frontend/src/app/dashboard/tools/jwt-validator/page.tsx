import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { JwtValidatorTool } from "@/components/tools/jwt-validator-tool"

export default function JWTValidatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <JwtValidatorTool />
          </main>
        </div>
      </div>
    </div>
  )
}
