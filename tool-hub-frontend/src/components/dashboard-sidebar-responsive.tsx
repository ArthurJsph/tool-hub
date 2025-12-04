"use client"

import { useAuth } from "@/contexts/AuthContext"
import { toolService } from "@/services/toolService"
import { getIcon } from "@/components/icon-mapper"
import { Tool } from "@/types/tool"
import {
  BarChart3,
  Users,
  Key,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Settings,
  FileText,
  LogOut,
  User
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SidebarProps {
  className?: string
}

export function DashboardSidebarResponsive({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Ferramentas"])
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const [activeTools, setActiveTools] = useState<Tool[]>([])

  useEffect(() => {
    const fetchActiveTools = async () => {
      try {
        const tools = await toolService.getActiveTools()
        setActiveTools(tools)
      } catch (error) {
        console.error("Failed to fetch active tools", error)
      }
    }
    fetchActiveTools()
  }, [])

  const toolMenuItems = activeTools.map(tool => ({
    title: tool.title,
    href: tool.href || `/dashboard/tools/${tool.key}`,
    icon: getIcon(tool.icon),
    key: tool.key
  }))

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
    },
    {
      title: "Ferramentas",
      icon: Key,
      submenu: toolMenuItems
    },
    ...(user?.role === 'ADMIN' ? [
      {
        title: "Usuários",
        icon: Users,
        href: "/dashboard/users",
      },
      {
        title: "Administração",
        icon: Shield,
        submenu: [
          { title: "Gerenciar Ferramentas", href: "/dashboard/tools/settings", icon: Key },
        ]
      }
    ] : []),
    {
      title: "Perfil",
      icon: Users,
      href: "/dashboard/profile",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      title: "Termos de Uso",
      icon: FileText,
      href: "/dashboard/terms",
    },
  ]

  // Fechar sidebar ao navegar em mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Tool Hub</h2>
        <p className="text-sm text-gray-500">Painel de Controle</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.href ? (
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                  </div>
                  {expandedMenus.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>

                {expandedMenus.includes(item.title) && item.submenu && item.submenu.length > 0 && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                          ${isActive(subItem.href)
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <subItem.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-4">
        <button
          onClick={() => logout()}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
        <div className="text-xs text-gray-500 text-center">
          Tool Hub v2.4
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle Button & Header */}
      <div className="md:hidden p-4 border-b bg-white flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="font-semibold text-lg">Tool Hub</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.username}
            </span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {isOpen && (
        <div className="md:hidden relative z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex w-64 bg-sidebar border-r border-sidebar-border h-full flex-col ${className}`}>
        {sidebarContent}
      </div>
    </>
  )
}

export default DashboardSidebarResponsive
