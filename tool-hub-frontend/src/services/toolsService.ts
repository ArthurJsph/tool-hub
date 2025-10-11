import {
  PasswordGeneratorParams,
  PasswordGeneratorResponse,
  JWTValidatorParams,
  JWTValidatorResponse,
  UUIDGeneratorResponse,
  Base64EncodeParams,
  Base64DecodeParams,
  Base64Response,
  HashGeneratorParams,
  HashGeneratorResponse,
} from '@/types/tools'
import apiService from './api'

export class ToolsService {
  // Gerador de Senhas
  static async generatePassword(params?: PasswordGeneratorParams): Promise<PasswordGeneratorResponse> {
    return apiService.get<PasswordGeneratorResponse>('/tools/password', params)
  }

  // Validador JWT
  static async validateJWT(params: JWTValidatorParams): Promise<JWTValidatorResponse> {
    return apiService.get<JWTValidatorResponse>('/tools/jwt/validate', params)
  }

  // Gerador UUID
  static async generateUUID(): Promise<UUIDGeneratorResponse> {
    return apiService.get<UUIDGeneratorResponse>('/tools/uuid')
  }

  // Base64 Encoder
  static async encodeBase64(params: Base64EncodeParams): Promise<Base64Response> {
    return apiService.get<Base64Response>('/tools/base64/encode', params)
  }

  // Base64 Decoder
  static async decodeBase64(params: Base64DecodeParams): Promise<Base64Response> {
    return apiService.get<Base64Response>('/tools/base64/decode', params)
  }

  // Gerador de Hash
  static async generateHash(params: HashGeneratorParams): Promise<HashGeneratorResponse> {
    return apiService.get<HashGeneratorResponse>('/tools/hash', params)
  }
}

export default ToolsService
