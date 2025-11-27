"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, Users } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import ApiService, { type Team } from "@/lib/api"

export function TeamCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getPublicTeam()
      setTeamMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Jamoa a'zolarini yuklashda xatolik yuz berdi")
      console.error("Error fetching team members:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 4,
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

  // Auto-play functionality
  useEffect(() => {
    if (!instanceRef.current) return

    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 4000)

    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Jamoa a'zolari yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Xatolik yuz berdi</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchTeamMembers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  if (teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Jamoa a'zolari topilmadi</h3>
          <p className="text-gray-500">Hozircha jamoa a'zolari ma'lumotlari mavjud emas.</p>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next team member"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}

      <div ref={sliderRef} className="keen-slider">
        {teamMembers.map((member) => (
          <div key={member.id} className="keen-slider__slide">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-white overflow-hidden h-full">
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div className="relative mb-6">
                  <Image
                    src={member.image || "/placeholder.svg?height=200&width=200&text=" + member.full_name.charAt(0)}
                    alt={member.full_name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full group-hover:opacity-0 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {member.full_name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.position_uz}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{member.description_uz}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="font-semibold text-blue-600">{member.experience}</div>
                    <div className="text-gray-600">Tajriba</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="font-semibold text-green-600">{member.technologies.length}+</div>
                    <div className="text-gray-600">Texnologiya</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {member.technologies.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.technologies.length > 4 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      +{member.technologies.length - 4}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-8 space-x-2">
          {teamMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to team member ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
