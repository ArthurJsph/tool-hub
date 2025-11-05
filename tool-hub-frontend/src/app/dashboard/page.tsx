import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebarResponsive } from "@/components/dashboard-sidebar-responsive"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - com responsividade */}
        <div className="md:w-64">
          <DashboardSidebarResponsive className="md:h-screen md:sticky md:top-0" />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <DashboardContent />
          </main>
        </div>
      </div>
    </div>
  )
}
