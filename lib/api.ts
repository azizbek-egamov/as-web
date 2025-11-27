import { config } from "./config"

const API_BASE_URL = config.api.baseUrl

// Types based on Django models
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface Project {
  id: number
  category: string
  name_uz: string
  name_ru: string
  name_en: string
  description_uz: string
  description_ru: string
  description_en: string
  year: string
  continuity: string
  team_size: string
  status: "completed" | "in_progress"
  technologies: string[]
  thoughts?: number
  images: ProjectImage[]
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: number
  product: number
  image: string
  created_at: string
}

export interface Team {
  id: number
  full_name: string
  email: string
  position_uz: string
  position_ru: string
  position_en: string
  description_uz: string
  description_ru: string
  description_en: string
  technologies: string[]
  experience: string
  linkedin?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: number
  full_name: string
  company: string
  position_uz: string
  position_ru: string
  position_en: string
  description_uz: string
  description_ru: string
  description_en: string
  rating: "1" | "2" | "3" | "4" | "5"
  image?: string
  created_at: string
  updated_at: string
}

export interface Partner {
  id: number
  company: string
  category: string
  website: string
  description: string
  logo: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  full_name: string
  email: string
  phone: number
  message: string
  status: "new" | "read" | "answered"
  created_at: string
  updated_at: string
}

export interface Setting {
  id: number
  website_name: string
  description: string
  email: string
  phone: number
  location: string
  facebook: string
  twitter: string
  linkedin: string
  instagram: string
  email_message: boolean
  sms_message: boolean
  technical_work: boolean
  technical_description: string
  created_at: string
  updated_at: string
}

export interface Achievements {
  experience_uz: string
  experience_ru: string
  experience_en: string
  projects: string
  clients: string
  experts: string
}

export interface DashboardStats {
  overview: {
    total_projects: number
    completed_projects: number
    in_progress_projects: number
    total_team: number
    total_partners: number
    total_testimonials: number
    total_messages: number
    new_messages: number
  }
  recent_activity: {
    recent_projects: number
    recent_messages: number
    recent_testimonials: number
  }
  charts: {
    monthly_data: Array<{
      month: string
      projects: number
      messages: number
    }>
    rating_distribution: Array<{
      rating: number
      count: number
    }>
    project_status: Array<{
      status: string
      count: number
    }>
    message_status: Array<{
      status: string
      count: number
    }>
  }
}

export interface ContactMessageData {
  full_name: string
  email: string
  phone: number
  message: string
}

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken()
        if (!refreshed) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("adminAuth")
          window.location.href = "/admin"
          throw new Error("Authentication failed")
        }
        // Retry the original request would need to be handled by the caller
        throw new Error("Token expired, please retry")
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private static async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout")
      }
      throw error
    }
  }

  // Authentication
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await this.handleResponse<LoginResponse>(response)

    // Store tokens
    localStorage.setItem("access_token", data.access)
    localStorage.setItem("refresh_token", data.refresh)
    localStorage.setItem("adminAuth", "true")

    return data
  }

  static async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) return false

    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access)
        return true
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }

    return false
  }

  static logout(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("adminAuth")
  }

  // Admin Statistics
  static async getAdminStatistics(): Promise<DashboardStats> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/statistics/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<DashboardStats>(response)
  }

  static async getDashboardSummary(): Promise<any> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/dashboard-summary/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<any>(response)
  }

  static async getRecentActivities(): Promise<any> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/recent-activities/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<any>(response)
  }

  static async getDetailedAnalytics(): Promise<any> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/detailed-analytics/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<any>(response)
  }

  // Projects
  static async getProjects(params?: { status?: string; year?: string }): Promise<Project[]> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.year) searchParams.append("year", params.year)

    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/projects/?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Project[]>(response)
  }

  static async createProject(data: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/projects/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Project>(response)
  }

  static async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/projects/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Project>(response)
  }

  static async deleteProject(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/projects/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.status}`)
    }
  }

  // Project Images
  static async uploadProjectImage(projectId: number, imageFile: File): Promise<ProjectImage> {
    const formData = new FormData()
    formData.append("image", imageFile)
    formData.append("product", projectId.toString())

    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/project-images/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<ProjectImage>(response)
  }

  static async deleteProjectImage(imageId: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/project-images/${imageId}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete project image: ${response.status}`)
    }
  }

  static async getProjectImages(projectId: number): Promise<ProjectImage[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/project-images/?product=${projectId}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<ProjectImage[]>(response)
  }

  // Team
  static async getTeam(): Promise<Team[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Team[]>(response)
  }

  static async createTeamMember(data: Partial<Team>): Promise<Team> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Team>(response)
  }

  static async createTeamMemberWithImage(formData: FormData): Promise<Team> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Team>(response)
  }

  static async updateTeamMember(id: number, data: Partial<Team>): Promise<Team> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Team>(response)
  }

  static async updateTeamMemberWithImage(id: number, formData: FormData): Promise<Team> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/${id}/`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Team>(response)
  }

  static async deleteTeamMember(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/team/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete team member: ${response.status}`)
    }
  }

  // Testimonials
  static async getTestimonials(params?: { rating?: string }): Promise<Testimonial[]> {
    const searchParams = new URLSearchParams()
    if (params?.rating) searchParams.append("rating", params.rating)

    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Testimonial[]>(response)
  }

  static async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Testimonial>(response)
  }

  static async createTestimonialWithImage(formData: FormData): Promise<Testimonial> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Testimonial>(response)
  }

  static async updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Testimonial>(response)
  }

  static async updateTestimonialWithImage(id: number, formData: FormData): Promise<Testimonial> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/${id}/`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Testimonial>(response)
  }

  static async deleteTestimonial(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/testimonials/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete testimonial: ${response.status}`)
    }
  }

  // Partners
  static async getPartners(params?: { category?: string }): Promise<Partner[]> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append("category", params.category)

    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Partner[]>(response)
  }

  static async createPartner(data: Partial<Partner>): Promise<Partner> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Partner>(response)
  }

  static async createPartnerWithLogo(formData: FormData): Promise<Partner> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Partner>(response)
  }

  static async updatePartner(id: number, data: Partial<Partner>): Promise<Partner> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Partner>(response)
  }

  static async updatePartnerWithLogo(id: number, formData: FormData): Promise<Partner> {
    const token = localStorage.getItem("access_token")
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/${id}/`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    return this.handleResponse<Partner>(response)
  }

  static async deletePartner(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/partners/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete partner: ${response.status}`)
    }
  }

  // Messages
  static async getMessages(params?: { status?: string }): Promise<Message[]> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)

    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/messages/?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Message[]>(response)
  }

  static async markMessageAsRead(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/messages/${id}/mark_as_read/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to mark message as read: ${response.status}`)
    }
  }

  static async markMessageAsAnswered(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/messages/${id}/mark_as_answered/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to mark message as answered: ${response.status}`)
    }
  }

  static async deleteMessage(id: number): Promise<void> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/messages/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.status}`)
    }
  }

  static async updateMessageStatus(id: number, status: "new" | "read" | "answered"): Promise<Message> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/messages/${id}/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    return this.handleResponse<Message>(response)
  }

  // Settings
  static async getSettings(): Promise<Setting[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/settings/`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Setting[]>(response)
  }

  static async updateSettings(id: number, data: Partial<Setting>): Promise<Setting> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/admin/settings/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<Setting>(response)
  }

  // Public endpoints
  static async getPublicProjects(): Promise<Project[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/projects/`)
    return this.handleResponse<Project[]>(response)
  }

  static async getPublicTeam(): Promise<Team[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/team/`)
    return this.handleResponse<Team[]>(response)
  }

  static async getPublicTestimonials(): Promise<Testimonial[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/testimonials/`)
    return this.handleResponse<Testimonial[]>(response)
  }

  static async getPublicPartners(): Promise<Partner[]> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/partners/`)
    return this.handleResponse<Partner[]>(response)
  }

  static async getPublicAchievements(): Promise<Achievements> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/achievements/`)
    return this.handleResponse<Achievements>(response)
  }

  static async getPublicSettings(): Promise<Setting> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/settings/`)
    return this.handleResponse<Setting>(response)
  }

  static async sendContactMessage(data: ContactMessageData): Promise<{ message: string; data: any }> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/public/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return this.handleResponse<{ message: string; data: any }>(response)
  }
}

export default ApiService
