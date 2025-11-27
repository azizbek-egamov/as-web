"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"

interface NavbarProps {
  language: string
  setLanguage: (lang: string) => void
  scrollToContact: () => void
  translations: any
}

export function InnovativeNavbar({ language, setLanguage, scrollToContact, translations }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [languageDropdown, setLanguageDropdown] = useState(false)

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Force navbar to be visible on projects page
      if (window.location.pathname === "/projects") {
        setScrolled(true)
      }

      // Active section detection
      const sections = ["hero", "about", "services", "projects", "team", "contact"]
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      setActiveSection(current || "")
    }

    handleScroll() // Call immediately to set initial state
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // If it's a hash link and we're not on home page, go to home page first
      if (window.location.pathname !== "/") {
        window.location.href = `/${href}`
        return
      }

      // If we're on home page, scroll to section
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      // If it's a regular link, navigate
      window.location.href = href
    }
    setMobileMenuOpen(false)
  }

  const navItems = [
    { id: "about", label: t.nav.about, href: "#about" },
    { id: "services", label: t.nav.services, href: "#services" },
    { id: "projects", label: t.nav.projects, href: "#projects" },
    { id: "team", label: t.nav.team, href: "#team" },
  ]

  const languages = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999999] transition-all duration-500 ${
        scrolled || window.location.pathname === "/projects"
          ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-blue-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center group">
            <div className="relative">
              <a href="/">
                <Image
                  src="/images/ardent-logo.png"
                  alt="ARDENT SOFT"
                  width={180}
                  height={40}
                  className="h-10 lg:h-12 w-auto transition-all duration-300 group-hover:scale-105 cursor-pointer"
                />
              </a>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  activeSection === item.id
                    ? "text-blue-600 bg-blue-50"
                    : scrolled
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      : "text-white hover:text-blue-200 hover:bg-white/10"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full ${
                    activeSection === item.id ? "w-full" : ""
                  }`}
                ></span>
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdown(!languageDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${languageDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {languageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLanguageDropdown(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                        language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Button */}
            <Button
              onClick={scrollToContact}
              className={`hidden sm:flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                scrolled
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              <span>{t.nav.contact}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 border border-gray-100 shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors rounded-xl mx-2"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 pt-2">
              <Button
                onClick={() => {
                  scrollToContact()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold"
              >
                {t.nav.contact}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close language dropdown */}
      {languageDropdown && <div className="fixed inset-0 z-40" onClick={() => setLanguageDropdown(false)}></div>}
    </header>
  )
}
