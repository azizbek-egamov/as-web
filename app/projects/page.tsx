"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Users, Code, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { InnovativeNavbar } from "@/components/innovative-navbar"
import ApiService, { type Project } from "@/lib/api"

const translations = {
  uz: {
    nav: {
      about: "Biz Haqimizda",
      services: "Xizmatlar",
      projects: "Loyihalar",
      team: "Jamoa",
      contact: "Bog'lanish",
    },
    projects: {
      title: "Barcha Loyihalarimiz",
      subtitle: "Biz yaratgan har bir loyiha - bu innovatsiya va professional yondashuvning namunasi",
      backToHome: "Bosh sahifaga qaytish",
      viewDetails: "Batafsil Ko'rish",
      category: "Kategoriya",
      duration: "Davomiyligi",
      team: "Jamoa",
      technologies: "Texnologiyalar",
      client: "Mijoz",
      year: "Yil",
      status: "Holati",
      completed: "Yakunlangan",
      inProgress: "Jarayonda",
      filterAll: "Barchasi",
      filterWeb: "Web Loyihalar",
      filterMobile: "Mobil Ilovalar",
      filterEcommerce: "E-commerce",
      filterCRM: "CRM Tizimlari",
    },
  },
  ru: {
    nav: {
      about: "О нас",
      services: "Услуги",
      projects: "Проекты",
      team: "Команда",
      contact: "Контакты",
    },
    projects: {
      title: "Все Наши Проекты",
      subtitle: "Каждый созданный нами проект - это образец инноваций и профессионального подхода",
      backToHome: "Вернуться на главную",
      viewDetails: "Подробнее",
      category: "Категория",
      duration: "Длительность",
      team: "Команда",
      technologies: "Технологии",
      client: "Клиент",
      year: "Год",
      status: "Статус",
      completed: "Завершен",
      inProgress: "В процессе",
      filterAll: "Все",
      filterWeb: "Веб Проекты",
      filterMobile: "Мобильные Приложения",
      filterEcommerce: "E-commerce",
      filterCRM: "CRM Системы",
    },
  },
  en: {
    nav: {
      about: "About Us",
      services: "Services",
      projects: "Projects",
      team: "Team",
      contact: "Contact",
    },
    projects: {
      title: "All Our Projects",
      subtitle: "Every project we create is a showcase of innovation and professional approach",
      backToHome: "Back to Home",
      viewDetails: "View Details",
      category: "Category",
      duration: "Duration",
      team: "Team",
      technologies: "Technologies",
      client: "Client",
      year: "Year",
      status: "Status",
      completed: "Completed",
      inProgress: "In Progress",
      filterAll: "All",
      filterWeb: "Web Projects",
      filterMobile: "Mobile Apps",
      filterEcommerce: "E-commerce",
      filterCRM: "CRM Systems",
    },
  },
}

export default function ProjectsPage() {
  const [language, setLanguage] = useState("uz")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState("all")
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const t = translations[language as keyof typeof translations]

  // Helper to get project field by current language with fallbacks
  const getProjectField = (project: Project, base: string) => {
    // try e.g. name_en, name_ru, fallback to name_uz, then plain base
    const keyed = `${base}_${language}` as keyof Project & string
    const fallbackUz = `${base}_uz` as keyof Project & string
    return ((project as any)[keyed] ?? (project as any)[fallbackUz] ?? (project as any)[base] ?? "") as string
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await ApiService.getPublicProjects()
        setProjects(projectsData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setError("Loyihalarni yuklashda xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    setMounted(true)

    // Check if there's a project ID in the URL query
    const searchParams = new URLSearchParams(window.location.search)
    const projectId = searchParams.get("id")

    if (projectId && projects.length > 0) {
      const project = projects.find((p) => p.id === Number.parseInt(projectId))
      if (project) {
        setSelectedProject(project)
      }
    }
  }, [projects])

  const scrollToContact = () => {
    // If we're on projects page, go to home page with contact hash
    window.location.href = "/#contact"
  }

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page with the section hash
    window.location.href = `/#${sectionId}`
  }

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true
    if (filter === "web")
      return project.category.toLowerCase().includes("web") || project.category.toLowerCase().includes("crm")
    if (filter === "mobile") return project.category.toLowerCase().includes("mobile")
    if (filter === "ecommerce")
      return (
        project.category.toLowerCase().includes("ecommerce") || project.category.toLowerCase().includes("e-commerce")
      )
    if (filter === "crm") return project.category.toLowerCase().includes("crm")
    return true
  })

  const filters = [
    { key: "all", label: t.projects.filterAll },
    { key: "web", label: t.projects.filterWeb },
    { key: "mobile", label: t.projects.filterMobile },
    { key: "ecommerce", label: t.projects.filterEcommerce },
    { key: "crm", label: t.projects.filterCRM },
  ]

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <InnovativeNavbar
          key="projects-navbar"
          language={language}
          setLanguage={setLanguage}
          scrollToContact={scrollToContact}
          translations={translations}
        />
        <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <InnovativeNavbar
          key="projects-navbar"
          language={language}
          setLanguage={setLanguage}
          scrollToContact={scrollToContact}
          translations={translations}
        />
        <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-white">
        <InnovativeNavbar
          key="projects-navbar"
          language={language}
          setLanguage={setLanguage}
          scrollToContact={scrollToContact}
          translations={translations}
        />

        {/* Project Detail - Added pt-27 to avoid navbar overlap */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              onClick={() => {
                setSelectedProject(null)
                // Update URL without the project ID
                window.history.pushState({}, "", "/projects")
              }}
              variant="outline"
              className="mb-8 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full mb-4">
                  <span className="text-blue-600 font-medium text-sm">{selectedProject.category}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                  {getProjectField(selectedProject, "name")}
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{getProjectField(selectedProject, "description")}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      {t.projects.year}
                    </h4>
                    <p className="text-gray-600">{selectedProject.year}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-blue-600" />
                      {t.projects.duration}
                    </h4>
                    <p className="text-gray-600">{selectedProject.continuity}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      {t.projects.team}
                    </h4>
                    <p className="text-gray-600">{selectedProject.team_size}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      {t.projects.status}
                    </h4>
                    <p className="text-gray-600">
                      {selectedProject.status === "completed" ? t.projects.completed : t.projects.inProgress}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">{t.projects.technologies}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProject.images.map((imageObj, index: number) => (
                    <div key={imageObj.id} className="relative group overflow-hidden rounded-xl">
                      <Image
                        src={imageObj.image || "/placeholder.svg"}
                        alt={`${getProjectField(selectedProject, "name")} screenshot ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <InnovativeNavbar
        key="projects-navbar"
        language={language}
        setLanguage={setLanguage}
        scrollToContact={scrollToContact}
        translations={translations}
      />

      {/* Projects Page - Added pt-27 to avoid navbar overlap */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Link href="/">
              <Button variant="outline" className="mb-8 flex items-center space-x-2 mx-auto bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                <span>{t.projects.backToHome}</span>
              </Button>
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
              {t.projects.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">{t.projects.subtitle}</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filterItem) => (
              <Button
                key={filterItem.key}
                onClick={() => setFilter(filterItem.key)}
                variant={filter === filterItem.key ? "default" : "outline"}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  filter === filterItem.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "hover:bg-blue-50"
                }`}
              >
                {filterItem.label}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={project.images && project.images.length > 0 ? project.images[0].image : "/placeholder.svg"}
                    alt={getProjectField(project, "name")}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status === "completed" ? t.projects.completed : t.projects.inProgress}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {getProjectField(project, "name")}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{getProjectField(project, "description")}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.year}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {project.team_size}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedProject(project)
                      // Update URL with project ID
                      window.history.pushState({}, "", `/projects?id=${project.id}`)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.projects.viewDetails}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
