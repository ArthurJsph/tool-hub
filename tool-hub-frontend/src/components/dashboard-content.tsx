"use client"

import { useAuth } from "@/contexts/AuthContext"
import { GlobalSearch } from "@/components/dashboard/GlobalSearch"
import { FavoritesSection } from "@/components/dashboard/FavoritesSection"
import { RecentHistorySection } from "@/components/dashboard/RecentHistorySection"
import { InfoCards } from "@/components/dashboard/InfoCards"

export function DashboardContent() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Olá, {user?.username || 'Visitante'}
        </h2>
        <p className="text-gray-500 mb-8">O que vamos construir hoje?</p>

        <GlobalSearch />
      </div>

      <InfoCards />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <FavoritesSection />
        </div>
        <div className="md:col-span-1">
          <RecentHistorySection />
        </div>
      </div>
    </div>
  )
}
