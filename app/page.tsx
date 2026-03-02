'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Film, Star, MessageSquare, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getUser } from "@/lib/auth/azure-swa-auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { isAuthenticated } = await getUser()
      if (isAuthenticated) {
        router.push("/app")
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Film className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Fliek Kyklys</h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            240 flieks georganiseer volgens bui - maklike keuses vir enige dag
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg h-14 px-8">
              <Link href="/login">Begin Kyk</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 bg-transparent">
              <Link href="/login">Teken Aan</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Hou Rekord</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Merk flieks as gekyk en hou 'n volledige geskiedenis van wat jy al gesien het.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Gradeer Flieks</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gee tot 10 sterre en onthou watter flieks jou gunstelinge is.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Aanbevelings</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kry slim aanbevelings gebaseer op jou en jou partner se smaak.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">12 Verskillende Buie</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Van lig en vrolik tot aksie en drama - daar's 'n bui vir elke dag.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border text-center">
          <h2 className="text-2xl font-bold mb-4">Maklik en Gebruikersvriendelik</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
            Ontwerp met groot knoppies en duidelike teks vir maklike gebruik. Perfek vir enige ouderdom.
          </p>
          <Button asChild size="lg" className="text-lg h-14 px-8">
            <Link href="/login">Kom ons Begin</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
