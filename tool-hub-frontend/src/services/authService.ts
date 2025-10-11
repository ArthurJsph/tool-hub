import { LoginRequestDTO, LoginResponseDTO } from '@/types/auth'
import apiService from './api'

export class AuthService {
  static async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    return apiService.post<LoginResponseDTO>('/auth/login', credentials)
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      // Pode ser implementado se o backend tiver endpoint para validar token
      // Por enquanto, assumimos que o interceptor do axios já trata isso
      return true
    } catch {
      return false
    }
  }
}

export default AuthService
