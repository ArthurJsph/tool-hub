"use client"

import { 
  BarChart3, 
  Users, 
  Key, 
  Shield, 
  Hash, 
  Binary,
  ChevronDown,
  ChevronRight,
  FileText
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Ferramentas",
    icon: Key,
    submenu: [
      { title: "Gerador de Senhas", href: "/dashboard/tools/password-generator", icon: Key },
      { title: "Validador JWT", href: "/dashboard/tools/jwt-validator", icon: Shield },
      { title: "Gerador UUID", href: "/dashboard/tools/uuid-generator", icon: Hash },
      { title: "Base64", href: "/dashboard/tools/base64", icon: Binary },
      { title: "Hash", href: "/dashboard/tools/hash", icon: Hash },
    ]
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "API Docs",
    icon: FileText,
    href: "/dashboard/swagger",
  },
]

export function DashboardSidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Ferramentas"])

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
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
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
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                  
                  {expandedMenus.includes(item.title) && item.submenu && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.href}
                          onClick={() => handleNavigate(subItem.href)}
                          className={`
                            w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                            ${isActive(subItem.href) 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-600 hover:bg-gray-50'
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
