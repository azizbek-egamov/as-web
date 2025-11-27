"use client"

import { useEffect } from "react"

import { useState } from "react"

import ApiService from "./api"

export interface AuthState {
  isAuthenticated: boolean
  user: any | null
  loading: boolean
}

export class AuthManager {
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token")
    const adminAuth = localStorage.getItem("adminAuth")
    return !!(token && adminAuth)
  }

  static async checkAuthStatus(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false
    }

    // Try to refresh token to verify it's still valid
    try {
      const refreshed = await ApiService.refreshToken()
      return refreshed
    } catch (error) {
      console.error("Auth check failed:", error)
      this.logout()
      return false
    }
  }

  static logout(): void {
    ApiService.logout()
    window.location.href = "/admin"
  }

  static getToken(): string | null {
    return localStorage.getItem("access_token")
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token")
  }
}

// Hook for authentication state
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await AuthManager.checkAuthStatus()
      setAuthState({
        isAuthenticated: isAuth,
        user: null, // Could fetch user data here if needed
        loading: false,
      })
    }

    checkAuth()
  }, [])

  return authState
}
