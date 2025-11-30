import { Key, FileText, Hash, Database, Shield, Lock, Link, Code, Search } from 'lucide-react'

export interface Tool {
    name: string
    description: string
    path: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    keywords: string[]
}

export const TOOLS: Tool[] = [
    { name: 'Gerador UUID', description: 'Gere UUIDs, ULIDs e NanoIDs', path: '/dashboard/tools/uuid-generator', icon: Key, keywords: ['uuid', 'id', 'ulid', 'nanoid'] },
    { name: 'Base64 Converter', description: 'Encode e Decode Base64', path: '/dashboard/tools/base64', icon: FileText, keywords: ['base64', 'encode', 'decode', 'string'] },
    { name: 'Gerador de Hash', description: 'MD5, SHA-1, SHA-256', path: '/dashboard/tools/hash-generator', icon: Hash, keywords: ['hash', 'md5', 'sha', 'crypto'] },
    { name: 'Mock Data', description: 'Gere dados falsos (JSON, CSV, SQL)', path: '/dashboard/tools/data-generator', icon: Database, keywords: ['mock', 'data', 'faker', 'json', 'sql'] },
    { name: 'Validador JWT', description: 'Decodifique e valide tokens JWT', path: '/dashboard/tools/jwt-validator', icon: Shield, keywords: ['jwt', 'token', 'decode'] },
    { name: 'Gerador de Senhas', description: 'Crie senhas fortes', path: '/dashboard/tools/password-generator', icon: Lock, keywords: ['password', 'senha', 'security'] },
    { name: 'Regex Tester', description: 'Teste expressões regulares', path: '/dashboard/tools/regex', icon: Search, keywords: ['regex', 'regexp', 'match'] },
    { name: 'URL Parser', description: 'Parse e construa URLs', path: '/dashboard/tools/url-parser', icon: Link, keywords: ['url', 'parser', 'query'] },
    { name: 'JSON Editor', description: 'Edite e formate JSON', path: '/dashboard/tools/json-jwt', icon: Code, keywords: ['json', 'editor', 'format'] },
]
