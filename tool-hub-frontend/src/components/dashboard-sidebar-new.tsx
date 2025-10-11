"use client"

import { Button } from "./Button"
import { 
  BarChart3, 
  Users, 
  Key, 
  Shield, 
  Hash, 
  Binary
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

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
      { title: "Gerador Hash", href: "/dashboard/tools/hash-generator", icon: Hash },
    ]
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/dashboard/users",
  }
]

export function DashboardSidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className={`w-64 bg-white border-r border-gray-200 ${className}`}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Navegação</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Button
                  variant={isActive(item.href) ? "primary" : "secondary"}
                  className="w-full justify-start text-left"
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </div>
                  {item.submenu && (
                    <div className="ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant={isActive(subItem.href) ? "primary" : "secondary"}
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => handleNavigate(subItem.href)}
                        >
                          <subItem.icon className="mr-2 h-3 w-3" />
                          {subItem.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
