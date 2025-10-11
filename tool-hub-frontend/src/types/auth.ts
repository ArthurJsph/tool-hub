export interface LoginRequestDTO {
  username: string
  password: string
}

export interface LoginResponseDTO {
  token: string
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginRequestDTO) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}
