"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import ApiService, { type Project } from "@/lib/api"

interface ProjectCarouselProps {
  language: string
  translations: any
}

export function ProjectCarousel({ language, translations }: ProjectCarouselProps) {
  const t = translations[language]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getName = (p: Project) =>
    language === "uz" ? p.name_uz : language === "ru" ? p.name_ru : p.name_en

  const getDesc = (p: Project) =>
    language === "uz" ? p.description_uz : language === "ru" ? p.description_ru : p.description_en

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await ApiService.getPublicProjects()
        setProjects(projectsData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setError(t.projects.error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [language]) // при смене языка перезагрузка перевода ошибок

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 1.1,
      spacing: 4,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1.5,
          spacing: 6,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 8,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 10,
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

  useEffect(() => {
    if (!instanceRef.current) return

    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 3000)

    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading) {
    return (
      <div className="relative w-full bg-gradient-to-r from-[#f7f9ff] to-[#edf3ff] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative w-full bg-gradient-to-r from-[#f7f9ff] to-[#edf3ff] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-r from-[#f7f9ff] to-[#edf3ff] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-center">
              {t.projects.no_projects}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full bg-gradient-to-r from-[#f7f9ff] to-[#edf3ff] py-8 md:py-12 group"
      role="region"
      aria-label="Project carousel"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div ref={sliderRef} className="keen-slider">
          {projects.map((project, idx) => {
            const isCenter = idx === currentSlide
            const projectImage =
              project.images && project.images.length > 0
                ? project.images[0].image
                : "/placeholder.svg?height=160&width=80&text=Phone"

            const title = getName(project)
            const description = getDesc(project)

            return (
              <div
                key={project.id}
                className={`keen-slider__slide transition-all duration-300 ${isCenter ? "scale-105 z-10" : "scale-100"
                  }`}
              >
                <div
                  className={`bg-white rounded-2xl p-4 sm:p-6 transition-all duration-300 h-[380px] sm:h-[410px] w-full max-w-[340px] sm:max-w-[360px] mx-auto ${isCenter ? "shadow-lg" : "shadow-sm hover:shadow-lg"
                    }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 h-full">
                    <div className="flex-1 flex flex-col h-full">
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center mb-3 sm:mb-4">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border bg-white/70 backdrop-blur text-gray-700">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="font-medium text-base sm:text-lg text-neutral-900 text-center mb-2 sm:mb-3">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground flex-1 line-clamp-3 text-center mb-3 sm:mb-4">
                        {description}
                      </p>

                      <div className="mt-auto">
                        <Link href={`/projects?id=${project.id}`} passHref>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 sm:h-9 text-xs uppercase rounded-lg w-full bg-transparent"
                          >
                            {t.projects.viewDetails}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-16 h-32 sm:w-20 sm:h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={projectImage}
                          alt={`${title} mockup`}
                          width={80}
                          height={160}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {loaded && instanceRef.current && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-20"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-20"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </>
        )}

        {loaded && instanceRef.current && (
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 md:hidden">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
