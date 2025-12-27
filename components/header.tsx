"use client"

import { Button } from "@/components/ui/button"
import { logout, type User } from "@/lib/auth/azure-swa-auth"
import { LogOut, Film } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header({ user }: { user: User }) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Fliek Kyklys</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Meld af</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
