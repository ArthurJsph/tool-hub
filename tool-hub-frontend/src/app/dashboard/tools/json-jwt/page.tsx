"use client"

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import Editor, { DiffEditor, OnMount } from '@monaco-editor/react'
import JsonView from '@uiw/react-json-view'
import { Copy, Clipboard, Check, AlertTriangle, AlignLeft, Minimize2, Wand2 } from 'lucide-react'
import { useToast } from '@/providers/ToastProvider'

export default function JSONEditorPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'tree' | 'diff'>('editor')
  const [code, setCode] = useState('{\n  "projeto": "Tool Hub",\n  "status": "Em desenvolvimento",\n  "features": [\n    "JSON Editor",\n    "Tree View"\n  ]\n}')
  const [diffOriginal, setDiffOriginal] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [stats, setStats] = useState({ size: '0 B', lines: 0 })
  const { toast } = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  useEffect(() => {
    validateJSON(code)
    updateStats(code)
  }, [code])

  const validateJSON = (value: string) => {
    try {
      if (!value.trim()) {
        setIsValid(true)
        setErrorMsg('')
        return
      }
      JSON.parse(value)
      setIsValid(true)
      setErrorMsg('')
    } catch (e) {
      setIsValid(false)
      setErrorMsg(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const updateStats = (value: string) => {
    const blob = new Blob([value])
    const size = blob.size
    let sizeStr = size + ' B'
    if (size > 1024) sizeStr = (size / 1024).toFixed(2) + ' KB'

    setStats({
      size: sizeStr,
      lines: value.split('\n').length
    })
  }

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(code)
      setCode(JSON.stringify(parsed, null, 2))
    } catch {
      toast({
        title: "Erro",
        description: "JSON inválido. Corrija antes de formatar.",
        variant: "destructive"
      })
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(code)
      setCode(JSON.stringify(parsed))
    } catch {
      toast({
        title: "Erro",
        description: "JSON inválido. Corrija antes de minificar.",
        variant: "destructive"
      })
    }
  }

  const handleFixJSON = () => {
    // Basic fix attempt: add quotes to keys
    try {
      // This is a very naive fix, real "Fix JSON" is complex. 
      // We'll try to use Function constructor to parse loose JSON (like JS objects)
      // WARNING: eval-like, but client-side only.

      const fixed = new Function('return ' + code)()
      setCode(JSON.stringify(fixed, null, 2))
      toast({
        title: "Sucesso",
        description: "Tentativa de correção aplicada.",
        variant: "default"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível corrigir automaticamente.",
        variant: "destructive"
      })
    }
  }


  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência"
      })
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao copiar",
        variant: "destructive"
      })
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setCode(text)
    } catch {
      toast({
        title: "Erro",
        description: "Falha ao colar. Verifique as permissões.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor e Formatador JSON</h1>
          <p className="text-gray-600 text-sm">Edite, valide e visualize JSON profissionalmente</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'tree' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Visualizador (Tree)
          </button>
          <button
            onClick={() => {
              setDiffOriginal(code) // Set current code as original when switching to diff
              setActiveTab('diff')
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'diff' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Diff (Comparar)
          </button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-md">
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
            <Button variant="ghost" size="sm" onClick={handlePaste} title="Colar">
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} title="Copiar">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrettify} className="text-xs border border-gray-300">
              <AlignLeft className="mr-1 h-3 w-3" /> Prettify
            </Button>
            <Button variant="secondary" size="sm" onClick={handleMinify} className="text-xs border border-gray-300">
              <Minimize2 className="mr-1 h-3 w-3" /> Minify
            </Button>
            <Button variant="secondary" size="sm" onClick={handleFixJSON} className="text-xs border border-gray-300">
              <Wand2 className="mr-1 h-3 w-3" /> Fix JSON
            </Button>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 relative bg-white">
          {activeTab === 'editor' && (
            <Editor
              height="100%"
              defaultLanguage="json"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          )}

          {activeTab === 'tree' && (
            <div className="h-full overflow-auto p-4">
              {isValid ? (
                <JsonView
                  value={JSON.parse(code || '{}')}
                  displayDataTypes={false}
                  enableClipboard={true}
                  style={{ fontSize: '14px', fontFamily: 'monospace' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">JSON Inválido</p>
                  <p className="text-sm mt-2">Corrija os erros no editor para visualizar a árvore.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'diff' && (
            <DiffEditor
              height="100%"
              language="json"
              original={diffOriginal}
              modified={code}
              options={{
                originalEditable: true, // Allow editing left side too
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className={`flex items-center justify-between px-4 py-2 border-t text-xs font-mono ${isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold">
              {isValid ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {isValid ? 'JSON Válido' : 'JSON Inválido'}
            </span>
            {!isValid && <span className="truncate max-w-md">{errorMsg}</span>}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Tamanho: {stats.size}</span>
            <span>Linhas: {stats.lines}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
