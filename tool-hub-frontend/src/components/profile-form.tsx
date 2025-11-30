"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card"
import { useToast } from "@/providers/ToastProvider"
import { User, Lock, Mail, Save } from "lucide-react"
import api from "@/services/api"

export function ProfileForm() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        passwordHash: "",
        confirmPassword: ""
    })

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username,
                email: user.email
            }))
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing, reset form
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    username: user.username,
                    email: user.email,
                    passwordHash: "",
                    confirmPassword: ""
                }))
            }
        }
        setIsEditing(!isEditing)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (formData.passwordHash && formData.passwordHash !== formData.confirmPassword) {
            toast({
                title: "Erro",
                description: "As senhas não coincidem",
                variant: "destructive"
            })
            setIsLoading(false)
            return
        }

        try {
            interface UpdateProfilePayload {
                username: string;
                email: string;
                passwordHash?: string;
            }

            const payload: UpdateProfilePayload = {
                username: formData.username,
                email: formData.email
            }

            if (formData.passwordHash) {
                payload.passwordHash = formData.passwordHash
            }

            await api.put("/users/me", payload)

            toast({
                title: "Sucesso",
                description: "Perfil atualizado com sucesso!",
                variant: "default"
            })
            setIsEditing(false)

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error)
            toast({
                title: "Erro",
                description: "Erro ao atualizar perfil. Tente novamente.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                        Detalhes da Conta
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Gerencie suas informações pessoais e segurança
                    </CardDescription>
                </div>
                {!isEditing && (
                    <Button
                        variant="secondary"
                        onClick={handleEditToggle}
                        type="button"
                        className="flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        Editar Perfil
                    </Button>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Header Section with Avatar */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group cursor-pointer mx-auto md:mx-0">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Alterar</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium text-gray-500">
                                    Nome de Usuário
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="text-base font-medium text-gray-900 py-2 border-b border-transparent">
                                        {formData.username}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-500">
                                    Email
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="text-base font-medium text-gray-900 py-2 border-b border-transparent">
                                        {formData.email}
                                    </div>
                                )}
                            </div>

                            {/* Role Field (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">
                                    Função / Cargo
                                </label>
                                <div className="flex items-center gap-2 py-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user?.role || 'USER'}
                                    </span>
                                </div>
                            </div>

                            {/* Member Since Field (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">
                                    Membro desde
                                </label>
                                <div className="text-base font-medium text-gray-900 py-2">
                                    {formatDate(user?.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Section - Only in Edit Mode */}
                    {isEditing && (
                        <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Segurança</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="passwordHash" className="text-sm font-medium text-gray-700">
                                        Nova Senha (Opcional)
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="passwordHash"
                                            name="passwordHash"
                                            type="password"
                                            placeholder="Digite para alterar"
                                            value={formData.passwordHash}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                        Confirmar Nova Senha
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirme a senha"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleEditToggle}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="min-w-[120px]"
                            >
                                {isLoading ? (
                                    "Salvando..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
