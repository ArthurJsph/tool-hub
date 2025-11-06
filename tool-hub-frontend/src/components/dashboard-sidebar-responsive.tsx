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
  FileText,
  Menu,
  X
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

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
      { title: "Hash", href: "/dashboard/tools/hash-generator", icon: Hash },
    ]
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/dashboard/users",
  },

]

export function DashboardSidebarResponsive({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Ferramentas"])
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Verificar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fechar sidebar ao navegar em mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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

  const sidebarContent = (
    <>
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
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
              </button>
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
                        <subItem.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{subItem.title}</span>
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
    </>
  )

  // Versão Mobile (Hamburger Menu)
  if (isMobile) {
    return (
      <div className={className}>
        {/* Botão Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar Mobile */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col overflow-y-auto">
              {sidebarContent}
            </div>
          </>
        )}
      </div>
    )
  }

  // Versão Desktop (Sidebar permanente)
  return (
    <div className={`w-64 bg-white border-r border-gray-200 h-full hidden md:flex flex-col ${className}`}>
      {sidebarContent}
    </div>
  )
}

export default DashboardSidebarResponsive
