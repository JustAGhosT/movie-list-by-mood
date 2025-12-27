import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Kyk jou e-pos</CardTitle>
            <CardDescription className="text-base">
              Ons het 'n bevestigingskakel na jou e-pos gestuur. Klik op die skakel om jou rekening te aktiveer.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Sien jy nie die e-pos nie? Kyk in jou spam-vouer.</p>
            <Link href="/auth/login" className="text-sm underline underline-offset-4 font-medium">
              Terug na aanmelding
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
