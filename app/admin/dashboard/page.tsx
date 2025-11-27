"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Users,
  FolderOpen,
  MessageSquare,
  Building,
  TrendingUp,
  Eye,
  Star,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react"
import ApiService, { type DashboardStats } from "@/lib/api"
import { AuthManager } from "@/lib/auth"

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  })

  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ApiService.getAdminStatistics()
      setDashboardData(data)
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error)
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi")

      // If token expired, try to refresh
      if (error.message.includes("Token expired")) {
        const refreshed = await ApiService.refreshToken()
        if (refreshed) {
          // Retry loading data
          try {
            const data = await ApiService.getAdminStatistics()
            setDashboardData(data)
            setError("")
          } catch (retryError: any) {
            setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const isAuth = await AuthManager.checkAuthStatus()
      if (!isAuth) {
        window.location.href = "/admin"
        return
      }

      loadDashboardData()
    }

    checkAuthAndLoad()
  }, [])

  const handleFilterApply = () => {
    loadDashboardData()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Ma'lumotlar yuklanmoqda...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error && !dashboardData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Xatolik yuz berdi</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData}>Qayta urinish</Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const stats = dashboardData
    ? {
        totalProjects: dashboardData.overview.total_projects,
        totalTeamMembers: dashboardData.overview.total_team,
        totalTestimonials: dashboardData.overview.total_testimonials,
        totalPartners: dashboardData.overview.total_partners,
        totalViews: 12500, // This might need to be added to backend
        avgRating: 4.8, // This might need to be calculated from testimonials
        newMessages: dashboardData.overview.new_messages,
      }
    : {
        totalProjects: 0,
        totalTeamMembers: 0,
        totalTestimonials: 0,
        totalPartners: 0,
        totalViews: 0,
        avgRating: 0,
        newMessages: 0,
      }

  const projectsData =
    dashboardData?.charts.monthly_data.map((item) => ({
      month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short" }),
      projects: item.projects,
      completed: Math.floor(item.projects * 0.8), // Estimate completed projects
    })) || []

  const categoryData = [
    { name: "Web Development", value: 35, color: "#3B82F6" },
    { name: "Mobile Apps", value: 25, color: "#8B5CF6" },
    { name: "E-commerce", value: 20, color: "#10B981" },
    { name: "CRM Systems", value: 15, color: "#F59E0B" },
    { name: "AI/ML", value: 5, color: "#EF4444" },
  ]

  const viewsData =
    dashboardData?.charts.monthly_data.map((item) => ({
      date: item.month,
      views: item.messages * 100, // Estimate views from messages
    })) || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Boshqaruv paneli statistikalari</p>
          </div>

          {/* Date Filter */}
          <Card className="xl:w-auto">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Boshlanish sanasi
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full sm:w-auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Tugash sanasi
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full sm:w-auto"
                  />
                </div>
                <Button onClick={handleFilterApply} className="w-full sm:w-auto" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Filter className="w-4 h-4 mr-2" />}
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
                <Button variant="outline" size="sm" onClick={loadDashboardData}>
                  Qayta yuklash
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Loyihalar</p>
                  <p className="text-3xl font-bold">{stats.totalProjects}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Jamoa</p>
                  <p className="text-3xl font-bold">{stats.totalTeamMembers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Fikrlar</p>
                  <p className="text-3xl font-bold">{stats.totalTestimonials}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Hamkorlar</p>
                  <p className="text-3xl font-bold">{stats.totalPartners}</p>
                </div>
                <Building className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Yangi Xabarlar</p>
                  <p className="text-3xl font-bold">{stats.newMessages}</p>
                </div>
                <Eye className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Reyting</p>
                  <p className="text-3xl font-bold">{stats.avgRating}</p>
                </div>
                <Star className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Projects Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Oylik Loyihalar Statistikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="projects" fill="#3B82F6" name="Jami" />
                    <Bar dataKey="completed" fill="#10B981" name="Tugallangan" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">Ma'lumotlar mavjud emas</div>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Loyihalar Kategoriyasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Oylik Faollik Statistikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">Ma'lumotlar mavjud emas</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
