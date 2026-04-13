"use client"

import { useTransition, useState } from "react"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "./_actions/login"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-svh flex">

      {/* ── Left — Hero panel ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex relative w-[52%] overflow-hidden bg-zinc-950 flex-col items-center justify-center">

        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">

          {/* Fine diagonal stripe grid */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 48px, rgba(255,255,255,1) 48px, rgba(255,255,255,1) 49px)",
          }} />

          {/* Accent lines — diagonal, fade in from top */}
          <div className="absolute top-0 left-[22%] h-full w-px bg-gradient-to-b from-white/0 via-white/12 to-white/0 -rotate-12 origin-top" />
          <div className="absolute top-0 left-[48%] h-full w-px bg-gradient-to-b from-white/0 via-white/8 to-white/0 -rotate-12 origin-top" />
          <div className="absolute top-0 left-[72%] h-full w-px bg-gradient-to-b from-white/0 via-white/6 to-white/0 -rotate-12 origin-top" />

          {/* Concentric circles — faint outlines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="160" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="260" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="360" fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="1" />
          </svg>

          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-primary/15 blur-[80px]" />
        </div>

        {/* Text — centered */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center px-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/25">
            République Démocratique du Congo
          </p>
          <h2 className="text-2xl font-bold text-white/80 leading-snug">
            Système d'Immatriculation<br />des Véhicules
          </h2>
        </div>

        {/* Bottom label */}
        <p className="absolute bottom-8 text-[10px] text-white/15 tracking-widest uppercase">
          VRS — RDC · Nord-Kivu · Sud-Kivu
        </p>
      </div>

      {/* ── Right — Form ────────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-10 sm:px-12 lg:px-16 bg-background">


        {/* Form */}
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Se connecter</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Entrez vos identifiants pour accéder au système.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-[13px] font-medium">
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                required
                placeholder="jp.kalala"
                disabled={isPending}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  disabled={isPending}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-2.5">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="h-10 w-full font-medium gap-2" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Connexion en cours…
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </div>

        {/* Bottom note */}
        <p className="absolute bottom-8 text-xs text-muted-foreground/60 text-center">
          Accès réservé au personnel autorisé · République Démocratique du Congo
        </p>
      </div>

    </div>
  )
}
