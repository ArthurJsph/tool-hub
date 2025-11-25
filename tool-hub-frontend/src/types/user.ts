export interface UserRequestDTO {
  username: string
  email: string
  passwordHash: string
  role: string
}

export interface UserResponseDTO {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface UsersListResponse {
  users: UserResponseDTO[]
  total: number
  page: number
  limit: number
}

// Alias for UserResponseDTO to be used in the application
export type User = UserResponseDTO

// Alias for UserRequestDTO for creation
export type CreateUserRequest = UserRequestDTO

// Update request can have optional fields
export interface UpdateUserRequest {
  username?: string
  email?: string
  passwordHash?: string
  role?: string
}
