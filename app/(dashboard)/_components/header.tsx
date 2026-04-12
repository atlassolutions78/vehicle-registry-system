"use client"

import { usePathname } from "next/navigation"
import { Bell, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/plates": "Gestion des Plaques",
  "/vehicles": "Véhicules enregistrés",
  "/vehicles/new": "Enregistrer un véhicule",
  "/nfc/register": "Enregistrer une carte NFC",
  "/nfc/verify": "Vérifier une carte NFC",
  "/search": "Recherche",
  "/users": "Gestion des utilisateurs",
}

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const title = pageTitles[pathname] ?? "VRS"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <span className="text-sm font-medium">{title}</span>
      <div className="ml-auto flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Changer le thème"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
      </div>
    </header>
  )
}
