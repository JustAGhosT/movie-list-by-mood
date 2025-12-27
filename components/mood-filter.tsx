"use client"

import { MOOD_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function MoodFilter({ selectedMood }: { selectedMood: string }) {
  const router = useRouter()

  const handleMoodChange = (mood: string) => {
    if (mood === "all") {
      router.push("/app")
    } else {
      router.push(`/app?mood=${encodeURIComponent(mood)}`)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Kies 'n Bui</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedMood === "all" ? "default" : "outline"}
          onClick={() => handleMoodChange("all")}
          className="h-auto py-3 px-4"
        >
          <span className="text-base">Alles</span>
        </Button>
        {MOOD_CATEGORIES.map((mood) => (
          <Button
            key={mood.number}
            variant={selectedMood === mood.name ? "default" : "outline"}
            onClick={() => handleMoodChange(mood.name)}
            className="h-auto py-3 px-4 gap-2"
          >
            <span className="text-lg">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
