"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, Globe, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import ApiService, { type Setting } from "@/lib/api"
import { AuthManager } from "@/lib/auth"

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const settingsData = await ApiService.getSettings()
      if (settingsData && settingsData.length > 0) {
        setSettings(settingsData[0]) // Usually there's only one settings record
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      setError("Sozlamalarni yuklashda xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setIsSaving(true)
      setError(null)

      await ApiService.updateSettings(settings.id, {
        website_name: settings.website_name,
        description: settings.description,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        facebook: settings.facebook,
        twitter: settings.twitter,
        linkedin: settings.linkedin,
        instagram: settings.instagram,
        email_message: settings.email_message,
        sms_message: settings.sms_message,
        technical_work: settings.technical_work,
        technical_description: settings.technical_description,
      })

      alert("Sozlamalar muvaffaqiyatli saqlandi!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      setError("Sozlamalarni saqlashda xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await AuthManager.checkAuthStatus()
      if (!isAuth) {
        window.location.href = "/admin"
        return
      }
      loadSettings()
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Sozlamalar yuklanmoqda...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadSettings}>Qayta urinish</Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Sozlamalar topilmadi</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
            <p className="text-gray-600 mt-1">Sayt sozlamalarini boshqarish</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Saqlash
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Umumiy</TabsTrigger>
            <TabsTrigger value="contact">Aloqa</TabsTrigger>
            <TabsTrigger value="social">Ijtimoiy</TabsTrigger>
            <TabsTrigger value="system">Tizim</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Umumiy Sozlamalar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website_name">Sayt nomi</Label>
                    <Input
                      id="website_name"
                      value={settings.website_name}
                      onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Sayt tavsifi</Label>
                    <Input
                      id="description"
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Aloqa Ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      type="number"
                      value={settings.phone || ""}
                      onChange={(e) => setSettings({ ...settings, phone: Number.parseInt(e.target.value) || null })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Manzil
                  </Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Ijtimoiy Tarmoqlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.facebook}
                      onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.twitter}
                      onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.linkedin}
                      onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.instagram}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bildirishnomalar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_message">Email bildirishnomalar</Label>
                      <p className="text-sm text-gray-600">Yangi xabarlar haqida email orqali xabar olish</p>
                    </div>
                    <Switch
                      id="email_message"
                      checked={settings.email_message}
                      onCheckedChange={(checked) => setSettings({ ...settings, email_message: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms_message">SMS bildirishnomalar</Label>
                      <p className="text-sm text-gray-600">Muhim xabarlar haqida SMS orqali xabar olish</p>
                    </div>
                    <Switch
                      id="sms_message"
                      checked={settings.sms_message}
                      onCheckedChange={(checked) => setSettings({ ...settings, sms_message: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Texnik Ishlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="technical_work">Texnik ishlar rejimi</Label>
                      <p className="text-sm text-gray-600">Saytni texnik ishlar uchun yopish</p>
                    </div>
                    <Switch
                      id="technical_work"
                      checked={settings.technical_work}
                      onCheckedChange={(checked) => setSettings({ ...settings, technical_work: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technical_description">Texnik ishlar xabari</Label>
                    <Textarea
                      id="technical_description"
                      value={settings.technical_description}
                      onChange={(e) => setSettings({ ...settings, technical_description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
