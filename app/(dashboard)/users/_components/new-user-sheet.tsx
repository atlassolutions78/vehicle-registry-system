"use client"

import { useState } from "react"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const ROLES = [
  { value: "ADMIN", label: "Admin", description: "Accès complet au système" },
  { value: "AGENT", label: "Agent", description: "Peut enregistrer véhicules et plaques" },
  { value: "LECTEUR", label: "Lecteur", description: "Consultation uniquement" },
]

interface FormData {
  name: string
  username: string
  role: string
  password: string
}

const initial: FormData = { name: "", username: "", role: "", password: "" }

interface NewUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewUserSheet({ open, onOpenChange }: NewUserSheetProps) {
  const [data, setData] = useState<FormData>(initial)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setData(initial)
    setShowPassword(false)
    setConfirmed(false)
    onOpenChange(false)
  }

  const isValid =
    data.name.trim() &&
    data.username.trim() &&
    data.role &&
    data.password.length >= 6

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        {!confirmed ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle>Ajouter un utilisateur</SheetTitle>
              <SheetDescription>
                Créez un compte d&apos;accès pour un nouvel agent ou administrateur.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <Label>Nom complet *</Label>
                <Input
                  placeholder="Jean-Pierre Kalala"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-2">
                <Label>Nom d&apos;utilisateur *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                  <Input
                    className="pl-7"
                    placeholder="jp.kalala"
                    value={data.username}
                    onChange={(e) => set("username", e.target.value.toLowerCase().replace(/\s/g, "."))}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2">
                <Label>Rôle *</Label>
                <Select value={data.role} onValueChange={(v) => set("role", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        <div className="flex flex-col">
                          <span>{r.label}</span>
                          <span className="text-xs text-muted-foreground">{r.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label>Mot de passe temporaire *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="Minimum 6 caractères"
                    value={data.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  L&apos;utilisateur devra changer ce mot de passe à la première connexion.
                </p>
              </div>
            </div>

            <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Annuler
              </Button>
              <Button className="flex-1" disabled={!isValid} onClick={() => setConfirmed(true)}>
                Créer le compte
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">Compte créé !</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">@{data.username}</span> peut maintenant se connecter avec le mot de passe temporaire.
              </p>
            </div>
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
