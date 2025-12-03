"use client"

import React from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Edit, Trash2, Power, PowerOff } from 'lucide-react'
import { ToolDTO } from '@/types/tools'

interface ToolsAdminListProps {
  tools: ToolDTO[]
  onEdit: (tool: ToolDTO) => void
  onDelete: (tool: ToolDTO) => void
  onToggleStatus: (tool: ToolDTO) => void
  isLoading?: boolean
}

export function ToolsAdminList({ 
  tools, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  isLoading = false 
}: ToolsAdminListProps) {
  
  if (isLoading) {
    return (
      <Card>
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramentas...</p>
        </div>
      </Card>
    )
  }

  if (tools.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <p className="text-gray-600">Nenhuma ferramenta encontrada.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Path
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ícone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Palavras-chave
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {tool.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {tool.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {tool.path}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {tool.icon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={tool.enabled ? 'success' : 'default'}>
                    {tool.enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {tool.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {tool.keywords.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{tool.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onToggleStatus(tool)}
                      title={tool.enabled ? 'Desativar' : 'Ativar'}
                    >
                      {tool.enabled ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(tool)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(tool)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
