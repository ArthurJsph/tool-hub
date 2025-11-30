import { Suspense } from "react"
import { ProfileForm } from "@/components/profile-form"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-border/40 pb-6">
                <h1 className="text-4xl mb-2 text-black tracking-tight">
                    Perfil
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Visualize e edite suas informações de perfil.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                }
            >
                <ProfileForm />
            </Suspense>
        </div>
    )
}
