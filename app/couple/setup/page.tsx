'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth/azure-swa-auth"
import { getCoupleProfile } from "@/lib/storage/localStorage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function CoupleSetupPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasCouple, setHasCouple] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { isAuthenticated } = await getUser()
      
      if (!isAuthenticated) {
        window.location.href = '/login'
        return
      }

      // Check if user already has a couple profile
      const existingCouple = getCoupleProfile()
      if (existingCouple) {
        router.push("/couple/dashboard")
        return
      }

      setIsLoading(false)
    }
    
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="h-12 w-12 text-primary fill-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to Couple's Movie Match!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Vind die perfekte fliek wat julle albei sal geniet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hoe dit werk:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Skep 'n couple profile met jou partner</li>
                <li>Rate flieks wat julle saam gekyk het (1-10 sterre)</li>
                <li>Stel julle genre voorkeure in</li>
                <li>Kry AI-aangedrewe aanbevelings van flieks wat julle albei sal geniet</li>
              </ol>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Wat jy sal kry:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Slim aanbevelings gebaseer op julle smaak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Insig in wat julle albei geniet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>"Tonight's Pick" vir maklike besluite</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Watch history en ratings</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/couple/setup/create">Skep Couple Profile</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/app">Terug na Hoof App</Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Julle sal albei toegang hê tot julle shared watch history en kan individueel rate.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
