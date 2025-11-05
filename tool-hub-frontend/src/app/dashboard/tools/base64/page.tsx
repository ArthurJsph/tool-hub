import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebarResponsive } from "@/components/dashboard-sidebar-responsive"
import { Base64Tool } from "@/components/tools/base64-tool"

export default function Base64Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64">
          <DashboardSidebarResponsive className="md:h-screen md:sticky md:top-0" />
        </div>
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Base64Tool />
          </main>
        </div>
      </div>
    </div>
  )
}
