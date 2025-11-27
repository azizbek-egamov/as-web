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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Users, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import ApiService, { type Team } from "@/lib/api"

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Team | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    position_uz: "",
    position_ru: "",
    position_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    technologies: "",
    experience: "",
    linkedin: "",
  })

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getTeam()
      setTeamMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik yuz berdi")
      console.error("Error fetching team members:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      position_uz: "",
      position_ru: "",
      position_en: "",
      description_uz: "",
      description_ru: "",
      description_en: "",
      technologies: "",
      experience: "",
      linkedin: "",
    })
    setEditingMember(null)
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllari qabul qilinadi")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak")
        return
      }

      const fileExtension = file.name.split(".").pop() || "jpg"
      const timestamp = Date.now()
      const shortName = `team_${timestamp}.${fileExtension}`

      // Create new file with shorter name
      const renamedFile = new File([file], shortName, { type: file.type })
      setSelectedImage(renamedFile)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()

      formDataToSend.append("full_name", formData.full_name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("position_uz", formData.position_uz)
      formDataToSend.append("position_ru", formData.position_ru)
      formDataToSend.append("position_en", formData.position_en)
      formDataToSend.append("description_uz", formData.description_uz)
      formDataToSend.append("description_ru", formData.description_ru)
      formDataToSend.append("description_en", formData.description_en)
      formDataToSend.append("technologies", JSON.stringify(formData.technologies.split(",").map((tech) => tech.trim())))
      formDataToSend.append("experience", formData.experience)
      formDataToSend.append("linkedin", formData.linkedin)

      if (selectedImage) {
        formDataToSend.append("image", selectedImage)
      }

      if (editingMember) {
        await ApiService.updateTeamMemberWithImage(editingMember.id, formDataToSend)
      } else {
        await ApiService.createTeamMemberWithImage(formDataToSend)
      }

      await fetchTeamMembers()
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik yuz berdi")
      console.error("Error saving team member:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (member: Team) => {
    setEditingMember(member)
    setFormData({
      full_name: member.full_name,
      email: member.email,
      position_uz: member.position_uz,
      position_ru: member.position_ru,
      position_en: member.position_en,
      description_uz: member.description_uz,
      description_ru: member.description_ru,
      description_en: member.description_en,
      technologies: member.technologies.join(", "),
      experience: member.experience,
      linkedin: member.linkedin || "",
    })
    if (member.image) {
      setImagePreview(member.image)
    }
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu jamoa a'zosini o'chirishni xohlaysizmi?")) {
      try {
        await ApiService.deleteTeamMember(id)
        await fetchTeamMembers()
      } catch (err) {
        setError(err instanceof Error ? err.message : "O'chirishda xatolik yuz berdi")
        console.error("Error deleting team member:", err)
      }
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position_uz.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      window.location.href = "/admin"
    }
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Jamoa a'zolari yuklanmoqda...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-800">{error}</p>
                <Button variant="outline" size="sm" onClick={() => setError(null)}>
                  Yopish
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jamoa Boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Jamoa a'zolarini qo'shish, tahrirlash va boshqarish</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Yangi A'zo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? "A'zoni Tahrirlash" : "Yangi A'zo Qo'shish"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label>Profil rasmi</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => {
                            setSelectedImage(null)
                            setImagePreview(null)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Rasm tanlash
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG formatida, maksimal 5MB</p>
                    </div>
                  </div>
                </div>

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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
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
                      <Label htmlFor="position-ru">Должность (Русский)</Label>
                      <Input
                        id="position-ru"
                        value={formData.position_ru}
                        onChange={(e) => setFormData({ ...formData, position_ru: e.target.value })}
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
                      <Label htmlFor="position-en">Position (English)</Label>
                      <Input
                        id="position-en"
                        value={formData.position_en}
                        onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
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
                    <Label htmlFor="technologies">Texnologiyalar (vergul bilan ajrating)</Label>
                    <Input
                      id="technologies"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, Node.js, Python"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Tajriba</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="5+ yil"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting || uploadingImage}
                  >
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={submitting || uploadingImage}>
                    {submitting || uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingImage
                          ? "Rasm yuklanmoqda..."
                          : editingMember
                            ? "Yangilanmoqda..."
                            : "Qo'shilmoqda..."}
                      </>
                    ) : editingMember ? (
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

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Ism yoki lavozim bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.full_name}
                    width={120}
                    height={120}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.full_name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position_uz}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.description_uz}</p>

                <div className="grid grid-cols-1 gap-4 mb-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="font-semibold text-blue-600">{member.experience}</div>
                    <div className="text-gray-600">Tajriba</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {member.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Jamoa a'zolari topilmadi</h3>
              <p className="text-gray-500">Qidiruv shartlaringizni o'zgartiring yoki yangi a'zo qo'shing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
