"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import ApiService, { type Testimonial } from "@/lib/api"

export function TestimonialsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getPublicTestimonials()
      setTestimonials(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
      console.error("Error loading testimonials:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 1,
          spacing: 24,
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

  // Auto-play functionality
  useEffect(() => {
    if (!instanceRef.current) return

    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)

    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mijozlar fikrlari yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Xatolik: {error}</p>
          <button
            onClick={loadTestimonials}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Hozircha mijozlar fikrlari mavjud emas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Navigation Arrows */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}

      <div ref={sliderRef} className="keen-slider">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="keen-slider__slide">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8 px-8">
              {/* Testimonial Image */}
              <div className="w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={testimonial.image || "/placeholder.svg?height=384&width=320&text=User"}
                  alt={testimonial.full_name}
                  width={320}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Testimonial Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl w-full max-w-md lg:max-w-lg flex-shrink-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(Number(testimonial.rating))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    ))}
                  </div>

                  <p className="text-white mb-6 leading-relaxed text-lg italic">"{testimonial.description_uz}"</p>

                  <div className="border-t border-blue-400 pt-6">
                    <h3 className="text-xl font-bold mb-1">{testimonial.full_name}</h3>
                    <p className="text-blue-100 text-sm mb-1 uppercase tracking-wide">{testimonial.position_uz}</p>
                    <p className="text-blue-200 text-sm">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
