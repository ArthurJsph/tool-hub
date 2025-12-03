"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Power, PowerOff } from "lucide-react"
import { Tool } from "@/types/tool"
import { toolService } from "@/services/toolService"
import { getIcon } from "@/components/icon-mapper"

export default function AdminToolsPage() {
    const [tools, setTools] = useState<Tool[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<Partial<Tool>>({
        key: "",
        title: "",
        description: "",
        icon: "",
        href: "",
        active: true,
    })

    useEffect(() => {
        fetchTools()
    }, [])

    const fetchTools = async () => {
        try {
            const data = await toolService.getAllTools()
            setTools(data)
        } catch (error) {
            console.error("Failed to fetch tools", error)
            alert("Não foi possível carregar as ferramentas.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await toolService.createTool(formData as Tool)
            alert("Ferramenta criada com sucesso.")
            setIsDialogOpen(false)
            setFormData({
                key: "",
                title: "",
                description: "",
                icon: "",
                href: "",
                active: true,
            })
            fetchTools()
        } catch (error) {
            console.error("Failed to create tool", error)
            alert("Erro ao criar ferramenta.")
        }
    }

    const toggleStatus = async (tool: Tool) => {
        try {
            await toolService.updateToolStatus(tool.id!, !tool.active)
            fetchTools()
        } catch (error) {
            console.error("Failed to update status", error)
            alert("Erro ao atualizar status.")
        }
    }

    const deleteTool = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta ferramenta?")) return

        try {
            await toolService.deleteTool(id)
            fetchTools()
        } catch (error) {
            console.error("Failed to delete tool", error)
            alert("Erro ao excluir ferramenta.")
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center">Carregando...</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciamento de Ferramentas</h1>
                    <p className="text-gray-500">
                        Gerencie as ferramentas disponíveis no sistema.
                    </p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nova Ferramenta
                </button>
            </div>

            {/* Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-lg font-semibold">Nova Ferramenta</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Título</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Chat Bot"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Chave Única (ID interno)</label>
                                    <input
                                        name="key"
                                        value={formData.key}
                                        onChange={handleInputChange}
                                        placeholder="Ex: chat_tool"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descrição</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Descrição da ferramenta..."
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ícone (Lucide React)</label>
                                    <input
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Zap"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rota (URL)</label>
                                    <input
                                        name="href"
                                        value={formData.href}
                                        onChange={handleInputChange}
                                        placeholder="Ex: /dashboard/tools/chat"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2 text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                                >
                                    Criar Ferramenta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Ícone</th>
                            <th className="px-6 py-3">Título</th>
                            <th className="px-6 py-3">Chave</th>
                            <th className="px-6 py-3">Rota</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tools.map((tool) => {
                            const Icon = getIcon(tool.icon);
                            return (
                                <tr key={tool.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <Icon className="h-5 w-5 text-gray-500" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{tool.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{tool.key}</td>
                                    <td className="px-6 py-4 text-gray-500">{tool.href}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tool.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {tool.active ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => toggleStatus(tool)}
                                            title={tool.active ? "Desativar" : "Ativar"}
                                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            {tool.active ? (
                                                <Power className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <PowerOff className="h-4 w-4 text-red-600" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deleteTool(tool.id!)}
                                            title="Excluir"
                                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {tools.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma ferramenta cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
