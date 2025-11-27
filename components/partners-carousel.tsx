"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useState, useEffect } from "react"
import Image from "next/image"
import ApiService, { type Partner } from "@/lib/api"

export function PartnersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 4,
          spacing: 24,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 5,
          spacing: 32,
        },
      },
    },
    loop: true,
    mode: "snap",
    drag: true,
    created() {
      setLoaded(true)
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const loadPartners = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getPublicPartners()
      setPartners(data)
      setError(null)
    } catch (error) {
      console.error("Failed to load partners:", error)
      setError("Hamkorlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!instanceRef.current || partners.length === 0) return

    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 3000)

    return () => clearInterval(interval)
  }, [instanceRef, partners.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Hamkorlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadPartners}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-600">Hamkorlar topilmadi</p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div ref={sliderRef} className="keen-slider">
        {partners.map((partner) => (
          <div key={partner.id} className="keen-slider__slide">
            <div className="flex flex-col items-center space-y-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center h-16 w-full">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.company}
                  width={120}
                  height={64}
                  className="object-contain max-h-16 max-w-full"
                />
              </div>
              <span className="font-bold text-lg text-gray-800 text-center">{partner.company}</span>
              <span className="text-sm text-blue-600 text-center">{partner.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {loaded && instanceRef.current && partners.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(partners.length / 5) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx * 5)}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentSlide / 5) === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to partner group ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
