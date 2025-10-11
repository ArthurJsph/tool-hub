export interface UserRequestDTO {
  username: string
  email: string
  password?: string
  roles: string[]
}

export interface UserResponseDTO {
  id: string
  username: string
  email: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface UsersListResponse {
  users: UserResponseDTO[]
  total: number
  page: number
  limit: number
}
