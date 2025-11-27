"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Mail, Eye, Trash2, Clock, User, Phone } from "lucide-react"
import ApiService from "@/lib/api"

interface Message {
  id: number
  full_name: string
  email: string
  phone: string
  message: string
  status: "new" | "read" | "answered"
  created_at: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getMessages()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xabarlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)

    if (message.status === "new") {
      try {
        await ApiService.updateMessageStatus(message.id, "read")
        setMessages(messages.map((m) => (m.id === message.id ? { ...m, status: "read" as const } : m)))
      } catch (err) {
        console.error("Failed to mark message as read:", err)
      }
    }
  }

  const handleStatusChange = async (messageId: number, newStatus: "new" | "read" | "answered") => {
    try {
      await ApiService.updateMessageStatus(messageId, newStatus)
      setMessages(messages.map((m) => (m.id === messageId ? { ...m, status: newStatus } : m)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xabar holatini yangilashda xatolik yuz berdi")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu xabarni o'chirishni xohlaysizmi?")) {
      try {
        await ApiService.deleteMessage(id)
        setMessages(messages.filter((m) => m.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Xabarni o'chirishda xatolik yuz berdi")
      }
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || message.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "answered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "Yangi"
      case "read":
        return "O'qilgan"
      case "answered":
        return "Javob berilgan"
      default:
        return "Noma'lum"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("uz-UZ") +
      " " +
      date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xabarlar</h1>
            <p className="text-gray-600 mt-1">Mijozlardan kelgan xabarlarni ko'rish va boshqarish</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {messages.filter((m) => m.status === "new").length} yangi
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {messages.filter((m) => m.status === "read").length} o'qilgan
              </Badge>
            </div>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
              <Button onClick={loadMessages} className="mt-2" size="sm">
                Qayta urinish
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Xabarlar yuklanmoqda...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Ism, email yoki xabar matni bo'yicha qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Holati" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barcha holat</SelectItem>
                        <SelectItem value="new">Yangi</SelectItem>
                        <SelectItem value="read">O'qilgan</SelectItem>
                        <SelectItem value="answered">Javob berilgan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`hover:shadow-md transition-shadow ${message.status === "new" ? "border-l-4 border-l-green-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">{message.full_name}</span>
                          </div>
                          <Badge className={getStatusColor(message.status)}>{getStatusText(message.status)}</Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 line-clamp-2">{message.message}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select
                          value={message.status}
                          onValueChange={(value: "new" | "read" | "answered") => handleStatusChange(message.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Yangi</SelectItem>
                            <SelectItem value="read">O'qilgan</SelectItem>
                            <SelectItem value="answered">Javob berilgan</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" onClick={() => handleViewMessage(message)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ko'rish
                        </Button>

                        <Button variant="destructive" size="sm" onClick={() => handleDelete(message.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMessages.length === 0 && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Xabarlar topilmadi</h3>
                  <p className="text-gray-500">Qidiruv shartlaringizni o'zgartiring.</p>
                </CardContent>
              </Card>
            )}

            {/* Message Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Xabar Tafsilotlari</DialogTitle>
                </DialogHeader>

                {selectedMessage && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ism</label>
                        <p className="text-gray-900">{selectedMessage.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedMessage.email}</p>
                      </div>
                      {selectedMessage.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Telefon</label>
                          <p className="text-gray-900">{selectedMessage.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-700">Sana</label>
                        <p className="text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Xabar</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Yopish
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedMessage.id, "answered")
                          setIsDialogOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Javob berilgan deb belgilash
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
