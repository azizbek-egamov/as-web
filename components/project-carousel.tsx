"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, ChevronRight, Users } from "lucide-react"
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
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1.3,
          spacing: 20,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 1.8,
          spacing: 24,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 2.3,
          spacing: 24,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 3,
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
      className="relative w-full overflow-hidden bg-gradient-to-br from-white via-[#f4f6ff] to-[#e9f1ff] py-10 md:py-14"
      role="region"
      aria-label="Project carousel"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-blue-300/60" />
        <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-purple-300/50" />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative p-4 sm:p-6 group">
          {/* Navigation Arrows */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Next project"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

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
                <div key={project.id} className="keen-slider__slide">
                  <div
                    className={`relative flex h-[500px] flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 ${
                      isCenter
                        ? "border-blue-200/90 shadow-2xl shadow-blue-200/60 scale-100 sm:scale-[1.02]"
                        : "border-slate-200/80 hover:-translate-y-1 hover:shadow-lg scale-[0.98]"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    <div className="relative h-48 w-full overflow-hidden bg-slate-50">
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-50" />
                      <Image
                        src={projectImage}
                        alt={title}
                        fill
                        sizes="600px"
                        className="object-contain p-4"
                      />
                    </div>

                    <div className="flex items-center justify-between px-5 pt-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                        {project.category}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          project.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {project.status === "completed" ? "Yakunlangan" : "Jarayonda"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 px-5 pt-3 pb-5">
                      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="line-clamp-3 text-sm text-slate-600">{description}</p>

                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        {project.year && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                            <CalendarDays className="h-4 w-4" />
                            {project.year}
                          </span>
                        )}
                        {project.team_size && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                            <Users className="h-4 w-4" />
                            {project.team_size}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Link href={`/projects?id=${project.id}`} passHref>
                          <Button
                            className="h-11 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            {t.projects.viewDetails}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        {loaded && instanceRef.current && (
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
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
