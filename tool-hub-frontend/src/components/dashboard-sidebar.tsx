"use client"

import {
  BarChart3,
  Users,
  Key,
  Shield,
  ChevronDown,
  ChevronRight,
  UserCircle
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toolService } from "@/services/toolService"
import { getIcon } from "@/components/icon-mapper"
import { Tool } from "@/types/tool"

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Ferramentas"])
  const { user } = useAuth()
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
    href: tool.href || `/dashboard/tools/${tool.key}`, // Fallback if href is missing
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
    // Only show Admin menus for ADMIN
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
      icon: UserCircle,
      href: "/dashboard/profile",
    },
  ]

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => pathname === href

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className={`w-64 bg-white border-r border-gray-200 h-full ${className}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Tool Hub</h2>
          <p className="text-sm text-gray-500">Painel de Controle</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <button
                  onClick={() => handleNavigate(item.href)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </div>
                    {expandedMenus.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {expandedMenus.includes(item.title) && item.submenu && item.submenu.length > 0 && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.href}
                          onClick={() => handleNavigate(subItem.href)}
                          className={`
                            w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                            ${isActive(subItem.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <subItem.icon className="mr-3 h-4 w-4" />
                          {subItem.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            Tool Hub v1.0
          </div>
        </div>
      </div>
    </div>
  )
}
