import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onUpload: (file: File) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({ onUpload, accept = ".pdf,.jpg,.jpeg,.png,.docx", maxSize = 10, className }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    setError(null)
    if (f.size > maxSize * 1024 * 1024) {
      setError(`File too large. Max ${maxSize}MB`)
      return
    }
    setFile(f)
    onUpload(f)
  }, [maxSize, onUpload])

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        dragOver ? "border-primary bg-primary/5" : "border-border",
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
    >
      {file ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or <label className="text-primary cursor-pointer hover:underline">browse</label>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Max {maxSize}MB — PDF, JPG, PNG, DOCX</p>
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </>
      )}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
