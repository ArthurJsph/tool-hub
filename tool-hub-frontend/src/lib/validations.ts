import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

// User Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const createUserSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  passwordHash: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['USER', 'ADMIN'])
})

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  passwordHash: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN']).optional()
})

// Tool Schemas
export const toolSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  path: z.string().min(1, 'Path é obrigatório').startsWith('/dashboard/tools/', 'Path deve começar com /dashboard/tools/'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  keywords: z.array(z.string()).min(1, 'Adicione pelo menos uma palavra-chave'),
  enabled: z.boolean(),
  order: z.number().int().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const createToolSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  path: z.string().min(1, 'Path é obrigatório').startsWith('/dashboard/tools/', 'Path deve começar com /dashboard/tools/'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  keywords: z.array(z.string()).min(1, 'Adicione pelo menos uma palavra-chave'),
  enabled: z.boolean().default(true),
  order: z.number().int().min(0).default(0)
})

export const updateToolSchema = createToolSchema.partial()

// Password Generator Schema
export const passwordGeneratorSchema = z.object({
  length: z.number().int().min(4).max(128).default(16),
  includeSymbols: z.boolean().default(true)
})

// JWT Validator Schema
export const jwtValidatorSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  algorithm: z.string().optional()
})

// Base64 Schema
export const base64Schema = z.object({
  input: z.string().min(1, 'Entrada é obrigatória')
})

// Hash Generator Schema
export const hashGeneratorSchema = z.object({
  input: z.string().min(1, 'Entrada é obrigatória'),
  algorithm: z.enum(['MD5', 'SHA1', 'SHA256', 'SHA512', 'BCRYPT']).default('SHA256')
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type UserData = z.infer<typeof userSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type ToolData = z.infer<typeof toolSchema>
export type CreateToolData = z.infer<typeof createToolSchema>
export type UpdateToolData = z.infer<typeof updateToolSchema>
export type PasswordGeneratorData = z.infer<typeof passwordGeneratorSchema>
export type JWTValidatorData = z.infer<typeof jwtValidatorSchema>
export type Base64Data = z.infer<typeof base64Schema>
export type HashGeneratorData = z.infer<typeof hashGeneratorSchema>
