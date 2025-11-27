"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  MessageSquare,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronDown,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthManager } from "@/lib/auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState("uz")
  const [languageDropdown, setLanguageDropdown] = useState(false)
  const pathname = usePathname()

  const languages = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Loyihalar",
      href: "/admin/projects",
      icon: FolderOpen,
    },
    {
      name: "Jamoa",
      href: "/admin/team",
      icon: Users,
    },
    {
      name: "Mijozlar Fikri",
      href: "/admin/testimonials",
      icon: MessageSquare,
    },
    {
      name: "Hamkorlar",
      href: "/admin/partners",
      icon: Building,
    },
    {
      name: "Xabarlar",
      href: "/admin/messages",
      icon: Mail,
    },
    {
      name: "Sozlamalar",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    AuthManager.logout()
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await AuthManager.checkAuthStatus()
      if (!isAuth) {
        window.location.href = "/admin"
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">ARDENT SOFT</h1>
              <p className="text-slate-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Stats Section */}
        <div className="px-4 py-4 flex-shrink-0">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-slate-300 text-sm font-medium mb-3">Tezkor Statistika</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">50</div>
                <div className="text-xs text-slate-400">Loyihalar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">15</div>
                <div className="text-xs text-slate-400">Jamoa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="px-4 pb-6 flex-shrink-0">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">Admin User</p>
                <p className="text-slate-400 text-xs truncate">Administrator</p>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden lg:block">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Xush kelibsiz,</span>
                  <span className="font-semibold text-gray-900">Admin</span>
                  <span className="text-gray-400">•</span>
                  <span>{new Date().toLocaleDateString("uz-UZ")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              {/* <div className="relative">
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${languageDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {languageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLanguageDropdown(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div> */}

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:bg-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>

      {/* Click outside to close language dropdown */}
      {languageDropdown && <div className="fixed inset-0 z-40" onClick={() => setLanguageDropdown(false)}></div>}
    </div>
  )
}
