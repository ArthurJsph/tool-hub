export interface PasswordGeneratorParams {
  length?: number
  includeSymbols?: boolean
  [key: string]: unknown
}

export interface PasswordGeneratorResponse {
  password: string
  length: number
  includeSymbols: boolean
}

export interface JWTValidatorParams {
  token: string
  algorithm?: string
  [key: string]: unknown
}

export interface JWTValidatorResponse {
  valid: boolean
  payload?: Record<string, unknown>
  error?: string
}

export interface UUIDGeneratorResponse {
  uuid: string
}

export interface Base64EncodeParams {
  input: string
  [key: string]: unknown
}

export interface Base64DecodeParams {
  input: string
  [key: string]: unknown
}

export interface Base64Response {
  result: string
  input: string
}

export interface HashGeneratorParams {
  input: string
  algorithm?: 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'BCRYPT'
  [key: string]: unknown
}

export interface HashGeneratorResponse {
  hash: string
  algorithm: string
  input: string
}

export type ToolType =
  | 'password-generator'
  | 'jwt-validator'
  | 'uuid-generator'
  | 'base64-encoder'
  | 'base64-decoder'
  | 'hash-generator'

export interface DnsResult {
  domain: string
  A: string[]
  MX: string[]
  TXT?: string[]
  NS?: string[]
  CNAME?: string[]
  error?: string
}

// Tool Management DTOs (for admin CRUD)
export interface ToolDTO {
  id: string
  name: string
  description: string
  path: string
  icon: string
  keywords: string[]
  enabled: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateToolRequest {
  name: string
  description: string
  path: string
  icon: string
  keywords: string[]
  enabled?: boolean
  order?: number
}

export interface UpdateToolRequest {
  name?: string
  description?: string
  path?: string
  icon?: string
  keywords?: string[]
  enabled?: boolean
  order?: number
}

export interface ToolsPageResponse {
  content: ToolDTO[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  last: boolean
  first: boolean
  empty: boolean
}
