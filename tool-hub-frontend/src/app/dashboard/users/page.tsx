import { Suspense } from "react"
import { UsersContent } from "@/components/users-content"
import { Loader2 } from "lucide-react"

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  )
}
