"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Building, Upload, X } from "lucide-react"
import Image from "next/image"
import ApiService, { type Partner } from "@/lib/api"

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company: "",
    category: "",
    website: "",
    description: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const generateShortFilename = (file: File): string => {
    const extension = file.name.split(".").pop() || "jpg"
    const timestamp = Date.now()
    return `partner_${timestamp}.${extension}`
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllari qabul qilinadi")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak")
        return
      }

      setLogoFile(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogoFile = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const loadPartners = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getPartners()
      setPartners(data)
    } catch (error) {
      console.error("Failed to load partners:", error)
      setError("Hamkorlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      company: "",
      category: "",
      website: "",
      description: "",
    })
    setLogoFile(null)
    setLogoPreview(null)
    setEditingPartner(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("company", formData.company)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("website", formData.website)
      formDataToSend.append("description", formData.description)

      if (logoFile) {
        // Create a new file with short name to avoid backend filename length error
        const shortFilename = generateShortFilename(logoFile)
        const renamedFile = new File([logoFile], shortFilename, { type: logoFile.type })
        formDataToSend.append("logo", renamedFile)
      }

      if (editingPartner) {
        const updatedPartner = await ApiService.updatePartnerWithLogo(editingPartner.id, formDataToSend)
        setPartners(partners.map((p) => (p.id === editingPartner.id ? updatedPartner : p)))
      } else {
        const newPartner = await ApiService.createPartnerWithLogo(formDataToSend)
        setPartners([...partners, newPartner])
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save partner:", error)
      setError(error instanceof Error ? error.message : "Hamkorni saqlashda xatolik yuz berdi")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      company: partner.company,
      category: partner.category,
      website: partner.website,
      description: partner.description,
    })
    setLogoPreview(partner.logo || null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu hamkorni o'chirishni xohlaysizmi?")) {
      try {
        await ApiService.deletePartner(id)
        setPartners(partners.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Failed to delete partner:", error)
        setError("Hamkorni o'chirishda xatolik yuz berdi")
      }
    }
  }

  const filteredPartners = partners.filter(
    (partner) =>
      partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    loadPartners()
  }, [])

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
            <p className="mt-4 text-gray-600">Hamkorlar yuklanmoqda...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hamkorlar Boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Hamkorlarni qo'shish, tahrirlash va boshqarish</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Hamkor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPartner ? "Hamkorni Tahrirlash" : "Yangi Hamkor Qo'shish"}</DialogTitle>
              </DialogHeader>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Kompaniya nomi</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoriya</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Technology, Finance, etc."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Veb-sayt</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Qisqa tavsif"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Logo tanlash
                      </Button>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      {logoFile && <span className="text-sm text-gray-600">{logoFile.name}</span>}
                    </div>

                    {logoPreview && (
                      <div className="relative inline-block">
                        <Image
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          width={120}
                          height={80}
                          className="object-contain border rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeLogoFile}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saqlanmoqda..." : editingPartner ? "Yangilash" : "Qo'shish"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Hamkor nomi yoki kategoriya bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.company}
                    width={120}
                    height={80}
                    className="mx-auto object-contain h-16"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.company}</h3>
                <p className="text-sm text-blue-600 mb-2">{partner.category}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{partner.description}</p>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(partner)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(partner.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hamkorlar topilmadi</h3>
              <p className="text-gray-500">Qidiruv shartlaringizni o'zgartiring yoki yangi hamkor qo'shing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
