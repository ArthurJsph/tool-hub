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

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-6 w-6 text-primary" />
                        Meu Perfil
                    </CardTitle>
                    <CardDescription>
                        Gerencie suas informações pessoais e de segurança
                    </CardDescription>
                </div>
                <Button
                    variant={isEditing ? "ghost" : "primary"}
                    onClick={handleEditToggle}
                    type="button"
                >
                    {isEditing ? "Cancelar" : "Editar"}
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Nome de Usuário
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Seu nome de usuário"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t animate-fade-in">
                                <div className="grid gap-2">
                                    <label htmlFor="passwordHash" className="text-sm font-medium">
                                        Nova Senha (Opcional)
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="passwordHash"
                                            name="passwordHash"
                                            type="password"
                                            placeholder="Nova senha"
                                            value={formData.passwordHash}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirmar Nova Senha
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end animate-fade-in">
                            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                {isLoading ? (
                                    "Salvando..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
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
