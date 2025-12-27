'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Github } from "lucide-react"
import { getUser } from "@/lib/auth/azure-swa-auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
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

  const handleLogin = () => {
    // Azure Static Web Apps will handle the authentication
    window.location.href = "/.auth/login/github"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Film className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Fliek Kyklys</CardTitle>
          <CardDescription className="text-lg mt-2">
            240 flieks georganiseer volgens bui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="w-full"
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Azure Static Web Apps
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">What you'll get:</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>✓ Browse 240 movies by mood</li>
              <li>✓ Rate movies you've watched</li>
              <li>✓ Get AI-powered couple recommendations</li>
              <li>✓ Never argue about movie night again!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
