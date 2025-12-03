"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { Button } from '@/components/Button'
import { ToolsAdminList } from '@/components/tools/tools-admin-list'
import { ToolForm } from '@/components/tools/tool-form'
import { useToast } from '@/providers/ToastProvider'
import { Plus, ArrowLeft } from 'lucide-react'
import { ToolDTO, CreateToolRequest, UpdateToolRequest } from '@/types/tools'
import toolsAdminService from '@/services/toolsAdminService'

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolDTO[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedTool, setSelectedTool] = useState<ToolDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const loadTools = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await toolsAdminService.getTools(0, 100)
      setTools(response.content)
    } catch (error) {
      console.error('Error loading tools:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar ferramentas',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTools()
  }, [loadTools])

  const handleCreate = async (data: CreateToolRequest | UpdateToolRequest) => {
    setIsSubmitting(true)
    try {
      await toolsAdminService.createTool(data as CreateToolRequest)
      toast({
        title: 'Sucesso',
        description: 'Ferramenta criada com sucesso',
        variant: 'success'
      })
      setViewMode('list')
      loadTools()
    } catch (error) {
      console.error('Error creating tool:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao criar ferramenta',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateToolRequest | UpdateToolRequest) => {
    if (!selectedTool) return
    
    setIsSubmitting(true)
    try {
      await toolsAdminService.updateTool(selectedTool.id, data as UpdateToolRequest)
      toast({
        title: 'Sucesso',
        description: 'Ferramenta atualizada com sucesso',
        variant: 'success'
      })
      setViewMode('list')
      setSelectedTool(null)
      loadTools()
    } catch (error) {
      console.error('Error updating tool:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar ferramenta',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (tool: ToolDTO) => {
    setSelectedTool(tool)
    setViewMode('edit')
  }

  const handleDelete = async (tool: ToolDTO) => {
    if (!confirm(`Tem certeza que deseja excluir a ferramenta "${tool.name}"?`)) {
      return
    }

    try {
      await toolsAdminService.deleteTool(tool.id)
      toast({
        title: 'Sucesso',
        description: 'Ferramenta excluída com sucesso',
        variant: 'success'
      })
      loadTools()
    } catch (error) {
      console.error('Error deleting tool:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir ferramenta',
        variant: 'destructive'
      })
    }
  }

  const handleToggleStatus = async (tool: ToolDTO) => {
    try {
      await toolsAdminService.toggleToolStatus(tool.id, !tool.enabled)
      toast({
        title: 'Sucesso',
        description: `Ferramenta ${!tool.enabled ? 'ativada' : 'desativada'} com sucesso`,
        variant: 'success'
      })
      loadTools()
    } catch (error) {
      console.error('Error toggling tool status:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status da ferramenta',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedTool(null)
  }

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciamento de Ferramentas
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Crie, edite e gerencie todas as ferramentas disponíveis no sistema
            </p>
          </div>
          
          {viewMode === 'list' && (
            <Button onClick={() => setViewMode('create')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ferramenta
            </Button>
          )}
          
          {viewMode !== 'list' && (
            <Button variant="secondary" onClick={handleCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à Lista
            </Button>
          )}
        </div>

        {/* Content */}
        {viewMode === 'list' && (
          <ToolsAdminList
            tools={tools}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        )}

        {viewMode === 'create' && (
          <ToolForm
            onSubmit={handleCreate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}

        {viewMode === 'edit' && selectedTool && (
          <ToolForm
            tool={selectedTool}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </AdminGuard>
  )
}
