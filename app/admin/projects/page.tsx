"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, FolderOpen, Loader2, AlertCircle, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import ApiService, { type Project, type ProjectImage } from "@/lib/api"
import { AuthManager } from "@/lib/auth"

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])

  const [formData, setFormData] = useState({
    name_uz: "",
    name_ru: "",
    name_en: "",
    category: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    year: "",
    continuity: "",
    team_size: "",
    status: "in_progress" as "completed" | "in_progress",
    technologies: "",
  })

  const categories = ["web", "mobile", "e_commerce", "crm", "ai_ml", "iot"]

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ApiService.getProjects({
        status: filterStatus !== "all" ? filterStatus : undefined,
        year: undefined,
      })
      setProjects(data)
    } catch (error: any) {
      console.error("Failed to load projects:", error)
      setError("Loyihalarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name_uz: "",
      name_ru: "",
      name_en: "",
      category: "",
      description_uz: "",
      description_ru: "",
      description_en: "",
      year: "",
      continuity: "",
      team_size: "",
      status: "in_progress",
      technologies: "",
    })
    setEditingProject(null)
    setSelectedImages([])
    setProjectImages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(",").map((tech) => tech.trim()),
      }

      let projectId: number
      if (editingProject) {
        const updatedProject = await ApiService.updateProject(editingProject.id, projectData)
        projectId = updatedProject.id
      } else {
        const newProject = await ApiService.createProject(projectData)
        projectId = newProject.id
      }

      if (selectedImages.length > 0) {
        await uploadImages(projectId)
      }

      resetForm()
      setIsDialogOpen(false)
      loadProjects() // Reload projects after successful operation
    } catch (error: any) {
      console.error("Failed to save project:", error)
      setError("Loyihani saqlashda xatolik yuz berdi")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (project: Project) => {
    setEditingProject(project)
    setFormData({
      name_uz: project.name_uz,
      name_ru: project.name_ru,
      name_en: project.name_en,
      category: project.category,
      description_uz: project.description_uz,
      description_ru: project.description_ru,
      description_en: project.description_en,
      year: project.year,
      continuity: project.continuity,
      team_size: project.team_size,
      status: project.status,
      technologies: project.technologies.join(", "),
    })
    await loadProjectImages(project.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu loyihani o'chirishni xohlaysizmi?")) {
      try {
        await ApiService.deleteProject(id)
        loadProjects() // Reload projects after deletion
      } catch (error: any) {
        console.error("Failed to delete project:", error)
        setError("Loyihani o'chirishda xatolik yuz berdi")
      }
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name_en.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || project.category === filterCategory
    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const isAuth = await AuthManager.checkAuthStatus()
      if (!isAuth) {
        window.location.href = "/admin"
        return
      }

      loadProjects()
    }

    checkAuthAndLoad()
  }, [filterStatus])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loyihalar yuklanmoqda...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = selectedImages.length + projectImages.length + files.length

    if (totalImages > 4) {
      setError("Maksimal 4 ta rasm yuklash mumkin")
      return
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      setError("Faqat JPG, PNG va WebP formatdagi rasmlar qabul qilinadi")
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError("Har bir rasm hajmi 5MB dan oshmasligi kerak")
      return
    }

    setSelectedImages((prev) => [...prev, ...files])
    setError("")
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeProjectImage = async (imageId: number) => {
    try {
      await ApiService.deleteProjectImage(imageId)
      setProjectImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (error: any) {
      console.error("Failed to delete image:", error)
      setError("Rasmni o'chirishda xatolik yuz berdi")
    }
  }

  const uploadImages = async (projectId: number) => {
    if (selectedImages.length === 0) return

    setUploadingImages(true)
    try {
      const uploadPromises = selectedImages.map((file) => ApiService.uploadProjectImage(projectId, file))

      const uploadedImages = await Promise.all(uploadPromises)
      setProjectImages((prev) => [...prev, ...uploadedImages])
      setSelectedImages([])
    } catch (error: any) {
      console.error("Failed to upload images:", error)
      setError("Rasmlarni yuklashda xatolik yuz berdi")
    } finally {
      setUploadingImages(false)
    }
  }

  const loadProjectImages = async (projectId: number) => {
    try {
      const images = await ApiService.getProjectImages(projectId)
      setProjectImages(images)
    } catch (error: any) {
      console.error("Failed to load project images:", error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loyihalar Boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Loyihalarni qo'shish, tahrirlash va boshqarish</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Loyiha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Loyihani Tahrirlash" : "Yangi Loyiha Qo'shish"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="uz" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="uz">O'zbek</TabsTrigger>
                    <TabsTrigger value="ru">Русский</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  {/* Existing tabs content */}
                  <TabsContent value="uz" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-uz">Loyiha nomi (O'zbek)</Label>
                      <Input
                        id="name-uz"
                        value={formData.name_uz}
                        onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-uz">Tavsif (O'zbek)</Label>
                      <Textarea
                        id="description-uz"
                        value={formData.description_uz}
                        onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ru" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-ru">Название проекта (Русский)</Label>
                      <Input
                        id="name-ru"
                        value={formData.name_ru}
                        onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-ru">Описание (Русский)</Label>
                      <Textarea
                        id="description-ru"
                        value={formData.description_ru}
                        onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">Project Title (English)</Label>
                      <Input
                        id="name-en"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-en">Description (English)</Label>
                      <Textarea
                        id="description-en"
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoriya</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Yil</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="continuity">Davomiyligi</Label>
                    <Input
                      id="continuity"
                      value={formData.continuity}
                      onChange={(e) => setFormData({ ...formData, continuity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team_size">Jamoa hajmi</Label>
                    <Input
                      id="team_size"
                      value={formData.team_size}
                      onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Holati</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "completed" | "in_progress") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">Jarayonda</SelectItem>
                        <SelectItem value="completed">Tugallangan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Texnologiyalar (vergul bilan ajrating)</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Loyiha rasmlari (maksimal 4 ta)</Label>

                  {/* Existing project images */}
                  {projectImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Mavjud rasmlar:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {projectImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <Image
                              src={image.image || "/placeholder.svg"}
                              alt="Project image"
                              width={150}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeProjectImage(image.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected images preview */}
                  {selectedImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Tanlangan rasmlar:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt="Selected image"
                              width={150}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeSelectedImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image upload input */}
                  {selectedImages.length + projectImages.length < 4 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Rasmlarni tanlash uchun bosing</p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, WebP formatlar qabul qilinadi (har biri max 5MB)
                        </p>
                        <p className="text-sm text-gray-500">
                          Qolgan: {4 - (selectedImages.length + projectImages.length)} ta rasm
                        </p>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={submitting || uploadingImages}>
                    {submitting || uploadingImages ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingImages
                          ? "Rasmlar yuklanmoqda..."
                          : editingProject
                            ? "Yangilanmoqda..."
                            : "Qo'shilmoqda..."}
                      </>
                    ) : editingProject ? (
                      "Yangilash"
                    ) : (
                      "Qo'shish"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
                <Button variant="outline" size="sm" onClick={loadProjects}>
                  Qayta yuklash
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Loyiha nomi bo'yicha qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Kategoriya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kategoriya</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Holati" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha holat</SelectItem>
                    <SelectItem value="completed">Tugallangan</SelectItem>
                    <SelectItem value="in_progress">Jarayonda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={project.images?.[0]?.image || "/placeholder.svg?height=200&width=300&text=Project"}
                  alt={project.name_uz}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant={project.status === "completed" ? "default" : "destructive"}>
                    {project.status === "completed" ? "Tugallangan" : "Jarayonda"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name_uz}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description_uz}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Yil:</span>
                    <span className="font-medium">{project.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jamoa:</span>
                    <span className="font-medium">{project.team_size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Davomiyligi:</span>
                    <span className="font-medium">{project.continuity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loyihalar topilmadi</h3>
              <p className="text-gray-500">Qidiruv shartlaringizni o'zgartiring yoki yangi loyiha qo'shing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
