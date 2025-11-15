import { UserRequestDTO, UserResponseDTO } from '@/types/user'
import apiService from './api'

export class UserService {
  static async getAllUsers(): Promise<UserResponseDTO[]> {
    return apiService.get<UserResponseDTO[]>('/users')
  }

  static async getUserById(id: string): Promise<UserResponseDTO> {
    return apiService.get<UserResponseDTO>(`/users/${id}`)
  }

  static async createUser(userData: UserRequestDTO): Promise<UserResponseDTO> {
    return apiService.post<UserResponseDTO>('/users', userData)
  }

  static async updateUser(id: string, userData: UserRequestDTO): Promise<UserResponseDTO> {
    return apiService.put<UserResponseDTO>(`/users/${id}`, userData)
  }

  static async deleteUser(id: string): Promise<void> {
    return apiService.delete<void>(`/users/${id}`)
  }
}

export default UserService
