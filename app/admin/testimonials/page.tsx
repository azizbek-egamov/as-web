"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Star, MessageSquare, Upload, X } from "lucide-react"
import Image from "next/image"
import ApiService, { type Testimonial } from "@/lib/api"

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")

  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    position_uz: "",
    position_ru: "",
    position_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    rating: "5" as "1" | "2" | "3" | "4" | "5",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getTestimonials(filterRating !== "all" ? { rating: filterRating } : undefined)
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
  }, [filterRating])

  const resetForm = () => {
    setFormData({
      full_name: "",
      company: "",
      position_uz: "",
      position_ru: "",
      position_en: "",
      description_uz: "",
      description_ru: "",
      description_en: "",
      rating: "5",
    })
    setSelectedImage(null)
    setImagePreview(null)
    setEditingTestimonial(null)
    setUploadProgress(0)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllarini tanlang")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak")
        return
      }

      // Generate shorter filename to avoid backend validation error
      const extension = file.name.split(".").pop()
      const shortName = `testimonial_${Date.now()}.${extension}`
      const renamedFile = new File([file], shortName, { type: file.type })

      setSelectedImage(renamedFile)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage)
      }

      let result: Testimonial
      if (editingTestimonial) {
        if (selectedImage) {
          result = await ApiService.updateTestimonialWithImage(editingTestimonial.id, formDataToSend)
        } else {
          result = await ApiService.updateTestimonial(editingTestimonial.id, formData)
        }
        setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? result : t)))
      } else {
        if (selectedImage) {
          result = await ApiService.createTestimonialWithImage(formDataToSend)
        } else {
          result = await ApiService.createTestimonial(formData)
        }
        setTestimonials([result, ...testimonials])
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
      console.error("Error saving testimonial:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      full_name: testimonial.full_name,
      company: testimonial.company,
      position_uz: testimonial.position_uz,
      position_ru: testimonial.position_ru,
      position_en: testimonial.position_en,
      description_uz: testimonial.description_uz,
      description_ru: testimonial.description_ru,
      description_en: testimonial.description_en,
      rating: testimonial.rating,
    })
    if (testimonial.image) {
      setImagePreview(testimonial.image)
    }
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu fikrni o'chirishni xohlaysizmi?")) {
      try {
        await ApiService.deleteTestimonial(id)
        setTestimonials(testimonials.filter((t) => t.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "O'chirishda xatolik yuz berdi")
        console.error("Error deleting testimonial:", err)
      }
    }
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = filterRating === "all" || testimonial.rating === filterRating

    return matchesSearch && matchesRating
  })

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      window.location.href = "/admin"
    }
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="float-right text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mijozlar Fikri</h1>
            <p className="text-gray-600 mt-1">Mijozlar fikrlarini qo'shish, tahrirlash va boshqarish</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Fikr
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? "Fikrni Tahrirlash" : "Yangi Fikr Qo'shish"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">To'liq ism</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Kompaniya</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Rasm</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input type="file" id="image" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Rasm tanlash
                      </Button>
                    </div>
                    {(imagePreview || selectedImage) && (
                      <div className="relative">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedImage && (
                    <p className="text-sm text-gray-600">
                      Tanlangan: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <Tabs defaultValue="uz" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="uz">O'zbek</TabsTrigger>
                    <TabsTrigger value="ru">Русский</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <TabsContent value="uz" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="position-uz">Lavozim (O'zbek)</Label>
                      <Input
                        id="position-uz"
                        value={formData.position_uz}
                        onChange={(e) => setFormData({ ...formData, position_uz: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-uz">Fikr matni (O'zbek)</Label>
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
                      <Label htmlFor="position-ru">Должность (Русский)</Label>
                      <Input
                        id="position-ru"
                        value={formData.position_ru}
                        onChange={(e) => setFormData({ ...formData, position_ru: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-ru">Текст отзыва (Русский)</Label>
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
                      <Label htmlFor="position-en">Position (English)</Label>
                      <Input
                        id="position-en"
                        value={formData.position_en}
                        onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-en">Review Text (English)</Label>
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
                    <Label htmlFor="rating">Reyting</Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) =>
                        setFormData({ ...formData, rating: value as "1" | "2" | "3" | "4" | "5" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 yulduz</SelectItem>
                        <SelectItem value="4">4 yulduz</SelectItem>
                        <SelectItem value="3">3 yulduz</SelectItem>
                        <SelectItem value="2">2 yulduz</SelectItem>
                        <SelectItem value="1">1 yulduz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saqlanmoqda..." : editingTestimonial ? "Yangilash" : "Qo'shish"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Ism yoki kompaniya bo'yicha qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Reyting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha reyting</SelectItem>
                    <SelectItem value="5">5 yulduz</SelectItem>
                    <SelectItem value="4">4 yulduz</SelectItem>
                    <SelectItem value="3">3 yulduz</SelectItem>
                    <SelectItem value="2">2 yulduz</SelectItem>
                    <SelectItem value="1">1 yulduz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.full_name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{testimonial.full_name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.position_uz}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(Number(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{testimonial.description_uz}</p>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTestimonials.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fikrlar topilmadi</h3>
              <p className="text-gray-500">Qidiruv shartlaringizni o'zgartiring yoki yangi fikr qo'shing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
