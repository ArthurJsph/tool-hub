import { LoginRequestDTO, LoginResponseDTO } from '@/types/auth'
import apiService from './api'

export class AuthService {
  static async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    // The token is now set in an HttpOnly cookie by the backend
    return apiService.post<LoginResponseDTO>('/auth/login', credentials)
  }

  static async refreshToken(): Promise<void> {
    return apiService.post<void>('/auth/refresh')
  }

  static async validateToken(): Promise<boolean> {
    try {
      // We can check if the user is authenticated by trying to fetch their profile
      await apiService.get('/users/me')
      return true
    } catch {
      // If validation fails, try to refresh token
      try {
        await this.refreshToken()
        // If refresh successful, try validation again
        await apiService.get('/users/me')
        return true
      } catch {
        return false
      }
    }
  }

  static async logout(): Promise<void> {
    return apiService.post<void>('/auth/logout')
  }
}

export default AuthService
