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
