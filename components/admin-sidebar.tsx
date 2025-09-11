"use client"

import { useAdminAuth } from "@/contexts/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Building2, Home, Users, Star, TrendingUp, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPage?: string
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen, currentPage }: AdminSidebarProps) {
  const { logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { id: "propiedades", label: "Propiedades", icon: Building2, href: "/admin/propiedades" },
    { id: "emprendimientos", label: "Emprendimientos", icon: TrendingUp, href: "/admin/emprendimientos" },
    { id: "destacadas", label: "Destacadas", icon: Star, href: "/admin/destacadas" },
    { id: "contactos", label: "Contactos", icon: Users, href: "/admin/contactos" },
    { id: "configuracion", label: "Configuración", icon: Settings, href: "/admin/configuracion" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={toggleSidebar}>
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Panel Administación</h1>
            <p className="text-sm text-muted-foreground">Gestión Inmobiliaria</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                asChild
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>
      )}
    </>
  )
}
