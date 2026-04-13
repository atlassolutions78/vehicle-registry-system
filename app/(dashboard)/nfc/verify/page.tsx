"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CreditCard, Loader2, ScanLine, SearchX, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlateBadge } from "@/components/plate-badge"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"
import { CarteRoseView } from "../../vehicles/[id]/_components/carte-rose-view"

const statusConfig = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  en_attente: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  suspendu: { label: "Suspendu", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

type SearchState = "idle" | "found" | "not_found"

export default function NfcVerifyPage() {
  const [uid, setUid] = useState("")
  const [searchUid, setSearchUid] = useState<string | null>(null)
  const [state, setState] = useState<SearchState>("idle")

  const { data: nfcVehiclesData } = trpc.vehicles.list.useQuery({ limit: 50 })
  const nfcVehicles = nfcVehiclesData?.rows.filter((v) => v.nfcUid) ?? []

  const { data: result, isFetching, isSuccess } = trpc.vehicles.byNfcUid.useQuery(
    searchUid ?? "",
    {
      enabled: !!searchUid,
    },
  )

  // Derive state from query result
  const displayState: SearchState = !searchUid ? "idle" : isFetching ? "idle" : isSuccess ? (result ? "found" : "not_found") : "idle"

  // Toast feedback when result arrives
  useEffect(() => {
    if (!isSuccess || !searchUid) return
    if (result) {
      toast.success(`Véhicule identifié : ${result.owner}`)
    } else {
      toast.error("Aucun véhicule trouvé pour cet UID")
    }
  }, [isSuccess, searchUid]) // eslint-disable-line react-hooks/exhaustive-deps

  function search(value?: string) {
    const query = (value ?? uid).trim().toUpperCase()
    if (!query) return
    setSearchUid(query)
  }

  function handleQuickScan(nfcUid: string) {
    setUid(nfcUid)
    setSearchUid(nfcUid.toUpperCase())
  }

  function reset() {
    setUid("")
    setSearchUid(null)
    setState("idle")
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Vérifier une carte NFC</h1>
        <p className="text-sm text-muted-foreground">
          Entrez l&apos;UID de la carte NFC pour identifier le véhicule associé.
        </p>
      </div>

      {/* Search area */}
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Wifi className="size-8 text-primary" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <ScanLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 font-mono"
              placeholder="04:A3:2B:1F:9C:00"
              value={uid}
              onChange={(e) => {
                setUid(e.target.value)
                if (displayState !== "idle") setState("idle")
              }}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <Button onClick={() => search()} disabled={!uid.trim() || isFetching} className="gap-2">
            {isFetching ? <Loader2 className="size-4 animate-spin" /> : null}
            Rechercher
          </Button>
          {displayState !== "idle" && (
            <Button variant="outline" onClick={reset}>
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Quick scan demos */}
        {displayState === "idle" && nfcVehicles.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground">Tester avec une carte enregistrée :</p>
            <div className="flex flex-wrap gap-2">
              {nfcVehicles.slice(0, 5).map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleQuickScan(v.nfcUid!)}
                  className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-mono transition-colors hover:bg-muted"
                >
                  <CreditCard className="size-3 text-muted-foreground" />
                  {v.nfcUid}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {!isFetching && displayState === "found" && result && (
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {/* Match banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-900/40 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <CreditCard className="size-5 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Carte NFC reconnue
                </p>
                <p className="font-mono text-xs text-green-700/70 dark:text-green-400/70">
                  {result.nfcUid}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[result.status].className}`}>
              {statusConfig[result.status].label}
            </span>
          </div>

          {/* Vehicle summary */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {result.plateProvinceCode && (
                <PlateBadge
                  province={result.plateProvinceCode}
                  digits={result.plateDigits ?? ""}
                  letters={result.plateLetters ?? ""}
                  year={result.plateYear ?? undefined}
                  size="lg"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{result.owner}</p>
                <p className="text-sm text-muted-foreground">
                  {result.make} {result.type} · {result.yearFabrication}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/vehicles/${result.id}`}>
                Voir la fiche complète
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* Carte Rose */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Carte Rose
            </p>
            <CarteRoseView vehicle={result} />
          </div>
        </div>
      )}

      {!isFetching && displayState === "not_found" && (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-xl border border-dashed py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Aucun véhicule trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">
              L&apos;UID{" "}
              <span className="font-mono text-foreground">{uid}</span>{" "}
              ne correspond à aucune carte NFC enregistrée.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            Nouvelle recherche
          </Button>
        </div>
      )}
    </div>
  )
}
