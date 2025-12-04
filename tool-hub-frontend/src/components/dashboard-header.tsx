"use client"

import React from "react"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export const DashboardHeader = React.memo(function DashboardHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="hidden md:block border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Title removed as requested */}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative group">
            <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline truncate max-w-xs">
                {user?.username || 'Usuário'}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 pt-2 w-48 hidden group-hover:block hover:block z-50">
              <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Meu Perfil
                </a>
                <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Configurações
                </a>

                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})
