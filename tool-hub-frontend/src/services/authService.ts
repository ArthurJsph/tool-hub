import { LoginRequestDTO, LoginResponseDTO } from '@/types/auth'
import apiService from './api'

export class AuthService {
  static async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    return apiService.post<LoginResponseDTO>('/auth/login', credentials)
  }

  static async validateToken(): Promise<boolean> {
    try {
      // Pode ser implementado se o backend tiver endpoint para validar token
      // Por enquanto, assumimos que o interceptor do axios já trata isso
      return true
    } catch {
      return false
    }
  }

  static async logout(): Promise<void> {
    return apiService.post<void>('/auth/logout')
  }

  static async register(data: { username: string; email: string; passwordHash: string; role: string }): Promise<unknown> {
    return apiService.post('/auth/register', data)
  }

  static async forgotPassword(email: string): Promise<void> {
    return apiService.post('/auth/forgot-password', { email })
  }
}

export default AuthService
