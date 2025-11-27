"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium py-2">
              Biz Haqimizda
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium py-2">
              Xizmatlar
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium py-2">
              Loyihalar
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium py-2">
              Jamoa
            </a>
          </nav>
        </div>
      )}
    </div>
  )
}
