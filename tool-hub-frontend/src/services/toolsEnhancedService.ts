import api from './api'

// JSON/JWT Parser
export interface ParseJWTRequest {
  data: string
}

export interface ParseJWTResponse {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: string
  valid: boolean
  message: string
}

export interface ParseJSONRequest {
  data: string
}

export interface FormatJSONRequest {
  data: string
  prettify?: boolean
}

export interface FormatJSONResponse {
  formatted: string
  parsed: unknown
  valid: boolean
}

// Faker
export interface GenerateFakerRequest {
  type: string
  count: number
  locale?: string
}

export interface GenerateFakerResponse {
  success: boolean
  type: string
  count: number
  locale: string
  data: unknown[]
}

// URL Parser
export interface ParseURLRequest {
  url: string
}

export interface ParseURLResponse {
  original: string
  protocol: string
  host: string
  port: number
  path: string
  query: string
  fragment: string
  authority: string
  userInfo: string
  parameters: Record<string, string[]>
  security: {
    isSecure: boolean
    hasUserInfo: boolean
  }
  reconstructed: string
  valid: boolean
}

export interface BuildURLRequest {
  protocol: string
  host: string
  port?: number
  path?: string
  parameters?: Record<string, string>
  fragment?: string
}

export interface BuildURLResponse {
  url: string
  success: boolean
}

// Regex
export interface TestRegexRequest {
  pattern: string
  text: string
}

export interface TestRegexResponse {
  pattern: string
  text: string
  matches: Array<{
    match: string
    start: number
    end: number
  }>
  matchCount: number
  hasMatch: boolean
  success: boolean
}

export interface ReplaceRegexRequest {
  pattern: string
  text: string
  replacement: string
}

export interface ReplaceRegexResponse {
  pattern: string
  original: string
  replacement: string
  result: string
  replacementCount: number
  success: boolean
}

export interface IdentifyRegexRequest {
  text: string
}

export interface IdentifyRegexResponse {
  text: string
  identifiedPatterns: string[]
  hasMatch: boolean
}

// URL Tester
export interface TestURLRequest {
  url: string
  method?: string
  headers?: Record<string, string>
  parameters?: Record<string, string>
  body?: string
  checkSecurity?: boolean
}

export interface TestURLResponse {
  success: boolean
  statusCode: number
  statusText: string
  headers: Record<string, string[]>
  body: string
  responseTime: string
  request: {
    url: string
    method: string
    headers: Record<string, string>
    parameters: Record<string, string>
    hasBody: boolean
  }
  security?: {
    isHttps: boolean
    protocol: string
    port: number
    isStandardPort: boolean
    recommendations: string[]
    securityScore: number
  }
}

// JSON/JWT Services
export const parseJWT = async (data: ParseJWTRequest): Promise<ParseJWTResponse> => {
  const response = await api.post<ParseJWTResponse>('/tools/json-jwt/parse-jwt', data)
  return response
}

export const parseJSON = async (data: ParseJSONRequest): Promise<FormatJSONResponse> => {
  const response = await api.post<FormatJSONResponse>('/tools/json-jwt/parse-json', data)
  return response
}

export const formatJSON = async (data: FormatJSONRequest): Promise<FormatJSONResponse> => {
  const response = await api.post<FormatJSONResponse>('/tools/json-jwt/format-json', data)
  return response
}

// Faker Services
export const generateFakeData = async (data: GenerateFakerRequest): Promise<GenerateFakerResponse> => {
  const response = await api.post<GenerateFakerResponse>('/tools/faker/generate', data)
  return response
}

export const getFakerTypes = async (): Promise<{ types: string[]; locales: string[] }> => {
  const response = await api.get<{ types: string[]; locales: string[] }>('/tools/faker/types')
  return response
}

// URL Parser Services
export const parseURL = async (data: ParseURLRequest): Promise<ParseURLResponse> => {
  const response = await api.post<ParseURLResponse>('/tools/url-parser/parse', data)
  return response
}

export const buildURL = async (data: BuildURLRequest): Promise<BuildURLResponse> => {
  const response = await api.post<BuildURLResponse>('/tools/url-parser/build', data)
  return response
}

// Regex Services
export const testRegex = async (data: TestRegexRequest): Promise<TestRegexResponse> => {
  const response = await api.post<TestRegexResponse>('/tools/regex/test', data)
  return response
}

export const replaceRegex = async (data: ReplaceRegexRequest): Promise<ReplaceRegexResponse> => {
  const response = await api.post<ReplaceRegexResponse>('/tools/regex/replace', data)
  return response
}

export const getRegexPatterns = async (): Promise<{ patterns: Record<string, string>; count: number }> => {
  const response = await api.get<{ patterns: Record<string, string>; count: number }>('/tools/regex/patterns')
  return response
}

export const identifyRegex = async (data: IdentifyRegexRequest): Promise<IdentifyRegexResponse> => {
  const response = await api.post<IdentifyRegexResponse>('/tools/regex/identify', data)
  return response
}

// URL Tester Services
export const testURL = async (data: TestURLRequest): Promise<TestURLResponse> => {
  const response = await api.post<TestURLResponse>('/tools/url-tester/test', data)
  return response
}

export const checkURLSecurity = async (url: string): Promise<unknown> => {
  const response = await api.post<unknown>('/tools/url-tester/security', { url })
  return response
}

export const getHTTPMethods = async (): Promise<{ methods: Array<{ method: string; description: string }> }> => {
  const response = await api.get<{ methods: Array<{ method: string; description: string }> }>('/tools/url-tester/methods')
  return response
}
