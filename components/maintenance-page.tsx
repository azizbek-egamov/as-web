"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Clock, Wrench, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

interface MaintenancePageProps {
  description?: string
}

export function MaintenancePage({ description }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <CardContent className="p-12 md:p-16">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/images/ardent-logo.png"
                alt="ARDENT SOFT"
                width={200}
                height={50}
                className="h-12 w-auto mx-auto brightness-0 invert"
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Texnik Ishlar</span>
            </div>

            {/* Main Icon */}
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Wrench className="w-16 h-16 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Texnik Ishlar Olib Borilmoqda
              </span>
            </h1>

            {/* Description */}
            <div className="mb-8">
              {description ? (
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">{description}</p>
              ) : (
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                  Saytimizda texnik ishlar olib borilmoqda. Tez orada qaytamiz va yanada yaxshi xizmat ko'rsatamiz!
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Settings className="w-8 h-8 text-white mb-4 mx-auto" />
                <h3 className="text-white font-bold text-lg mb-2">Yangilanish</h3>
                <p className="text-white/80 text-sm">Saytimizni yanada yaxshiroq qilish uchun ishlamoqdamiz</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Clock className="w-8 h-8 text-white mb-4 mx-auto" />
                <h3 className="text-white font-bold text-lg mb-2">Tez Orada</h3>
                <p className="text-white/80 text-sm">Qisqa vaqt ichida qaytamiz va xizmatni davom ettiramiz</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Sparkles className="w-8 h-8 text-white mb-4 mx-auto" />
                <h3 className="text-white font-bold text-lg mb-2">Yangi Imkoniyatlar</h3>
                <p className="text-white/80 text-sm">Yangi funksiyalar va yaxshilanishlar bilan qaytamiz</p>
              </div>
            </div>
   
            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-white font-bold text-xl mb-4">Shoshilinch holatlarda biz bilan bog'laning:</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+998901234567"
                  className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
                >
                  📞 +998 90 123 45 67
                </a>
                <a
                  href="mailto:info@ardentsoft.uz"
                  className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
                >
                  ✉️ info@ardentsoft.uz
                </a>
              </div>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sahifani Yangilash
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/60 text-sm">© 2024 ArdentSoft. Barcha huquqlar himoyalangan.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
