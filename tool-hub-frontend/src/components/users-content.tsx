"use client"

import { useState } from "react"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { Input } from "@/components/Input"
import { Users, Plus, Search, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiService from "@/services/api"
import { useToast } from "@/providers/ToastProvider"

// Tipo para erros de API
interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
  message?: string
}

interface UserFormData {
  username: string
  email: string
  passwordHash: string
  role: string
}

export function UsersContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    passwordHash: "",
    role: "USER"
  })
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Buscar usuários da API
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
    retry: (failureCount, error: unknown) => {
      // Não retry se for erro 401 (será tratado pelo interceptor)
      if ((error as ApiError)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    }
  })

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: (userData: UserFormData) => apiService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: "Usuário criado!",
        description: "Usuário criado com sucesso",
      })
      handleCloseModal()
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro",
        description: (error as ApiError)?.response?.data?.message || "Erro ao criar usuário",
        variant: "destructive"
      })
    }
  })

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<UserFormData> }) => 
      apiService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: "Usuário atualizado!",
        description: "Usuário atualizado com sucesso",
      })
      handleCloseModal()
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro",
        description: (error as ApiError)?.response?.data?.message || "Erro ao atualizar usuário",
        variant: "destructive"
      })
    }
  })

  // Mutation para deletar usuário
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: "Usuário deletado!",
        description: "Usuário removido com sucesso",
      })
    },
    onError: (error: unknown) => {
      toast({
        title: "Erro",
        description: (error as ApiError)?.response?.data?.message || "Erro ao deletar usuário",
        variant: "destructive"
      })
    }
  })

  const handleOpenCreateModal = () => {
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      passwordHash: "",
      role: "USER"
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (user: unknown) => {
    const u = user as { id: string; username: string; email: string; role?: string }
    setEditingUser(u.id)
    setFormData({
      username: u.username,
      email: u.email,
      passwordHash: "",
      role: u.role || "USER"
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      passwordHash: "",
      role: "USER"
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      // Update user - password is optional
      const updateData: Partial<UserFormData> = {
        username: formData.username,
        email: formData.email,
        role: formData.role
      }
      if (formData.passwordHash) {
        updateData.passwordHash = formData.passwordHash
      }
      updateUserMutation.mutate({ id: editingUser, userData: updateData })
    } else {
      // Create user - password is required
      if (!formData.passwordHash) {
        toast({
          title: "Erro",
          description: "Senha é obrigatória para criar um novo usuário",
          variant: "destructive"
        })
        return
      }
      createUserMutation.mutate(formData)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      deleteUserMutation.mutate(userId)
    }
  }

  const filteredUsers = users.filter(user =>
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-red-600 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar usuários
          </h3>
          <p className="text-gray-600 mb-4">
            {(error as ApiError)?.response?.data?.message || "Não foi possível conectar com o servidor"}
          </p>
          <Button onClick={() => refetch()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-gray-600">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Lista de Usuários</h3>
            <Badge variant="default" className="ml-auto">
              {filteredUsers.length} usuários
            </Badge>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando usuários...</span>
            </div>
          )}

          {/* Users Table */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Usuário</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Função</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Criado em</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {(user.username || 'U').charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.username || 'Nome não informado'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'Admin' ? 'warning' : 'default'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {/* Status não disponível na API atual */}
                        <Badge variant="default">
                          Ativo
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          className="text-xs"
                          onClick={() => handleOpenEditModal(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="danger" 
                          className="text-xs"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          {deleteUserMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando um novo usuário.'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome de Usuário *
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Digite o nome de usuário"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha {editingUser ? "(deixe em branco para não alterar)" : "*"}
                </label>
                <Input
                  type="password"
                  value={formData.passwordHash}
                  onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                  placeholder="Digite a senha"
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil *
                </label>
                <select
                  value={formData.role || "USER"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {createUserMutation.isPending || updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingUser ? "Atualizar" : "Criar"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
