import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import { DnsResult } from '@/types/tools'

class ApiService {
  private api: AxiosInstance

  constructor() {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

    // Ensure API URL ends with /api/v1
    if (!apiUrl.includes('/api/v1')) {
      apiUrl = `${apiUrl.replace(/\/$/, '')}/api/v1`
    }

    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Interceptor para tratar erros de resposta
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          Cookies.remove('token')
          // Dispara evento customizado para notificar sobre sessão expirada
          window.dispatchEvent(new CustomEvent('sessionExpired'))
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  // Métodos genéricos
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url)
    return response.data
  }

  // Métodos específicos para debug
  getAxiosInstance(): AxiosInstance {
    return this.api
  }

  // Métodos das ferramentas
  async generatePassword(params?: {
    length?: number
    includeSymbols?: boolean
  }): Promise<string> {
    const response = await this.get<string>('/tools/password', params)
    return response
  }

  async validateJWT(token: string, algorithm?: string): Promise<string> {
    const response = await this.get<string>('/tools/jwt/validate', {
      token,
      algorithm: algorithm || 'HS256'
    })
    return response
  }

  async generateUUID(): Promise<string> {
    const response = await this.get<string>('/tools/uuid')
    return response
  }

  async encodeBase64(input: string): Promise<string> {
    const formData = new FormData()
    formData.append('input', input)
    const response = await this.api.post<string>('/tools/base64/encode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async decodeBase64(input: string): Promise<string> {
    const formData = new FormData()
    formData.append('input', input)
    const response = await this.api.post<string>('/tools/base64/decode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async generateHash(input: string, algorithm?: string): Promise<string> {
    const formData = new FormData()
    formData.append('input', input)
    formData.append('algorithm', algorithm || 'SHA256')
    const response = await this.api.post<string>('/tools/hash', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Cache para contagem de usuários
  private userCountCache: { count: number; timestamp: number } | null = null
  private usageTodayCache: { count: number; timestamp: number } | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Métodos de usuários
  async getUserCount(): Promise<number> {
    const now = Date.now()
    if (this.userCountCache && (now - this.userCountCache.timestamp < this.CACHE_DURATION)) {
      return this.userCountCache.count
    }

    const response = await this.get<number>('/users/count')
    this.userCountCache = { count: response, timestamp: now }
    return response
  }

  async getUsageToday(): Promise<number> {
    const now = Date.now()
    if (this.usageTodayCache && (now - this.usageTodayCache.timestamp < this.CACHE_DURATION)) {
      return this.usageTodayCache.count
    }

    const response = await this.get<number>('/users/me/usage/today')
    this.usageTodayCache = { count: response, timestamp: now }
    return response
  }

  // Ferramentas
  async dnsLookup(domain: string): Promise<DnsResult> {
    return this.get<DnsResult>(`/tools/dns/lookup?domain=${domain}`)
  }

  async getUsers(): Promise<User[]> {
    const response = await this.get<User[]>('/users')
    return response
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.get<User>(`/users/${id}`)
    return response
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.post<User>('/users', userData)
    return response
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await this.api.patch<User>(`/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete<void>(`/users/${id}`)
  }
}

export const apiService = new ApiService()
export default apiService
