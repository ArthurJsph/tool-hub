import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-border/40 pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Perfil
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Visualize e edite suas informações de perfil.
                </p>
            </div>

            <ProfileForm />
        </div>
    )
}
