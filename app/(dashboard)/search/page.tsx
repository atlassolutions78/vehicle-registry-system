"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, SearchX } from "lucide-react"

import { Input } from "@/components/ui/input"
import { PlateBadge } from "@/components/plate-badge"
import { mockVehicles, type Vehicle } from "../vehicles/_components/mock-data"

const statusConfig = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  en_attente: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  suspendu: { label: "Suspendu", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

function matchesQuery(vehicle: Vehicle, query: string): boolean {
  const q = query.toLowerCase()
  return (
    vehicle.owner.toLowerCase().includes(q) ||
    vehicle.plateDigits.includes(q) ||
    vehicle.plateLetters.toLowerCase().includes(q) ||
    vehicle.plateProvince.toLowerCase().includes(q) ||
    vehicle.chassisNumber.toLowerCase().includes(q) ||
    vehicle.engineNumber.toLowerCase().includes(q) ||
    vehicle.taxNumber.toLowerCase().includes(q) ||
    (vehicle.nfcUid?.toLowerCase().includes(q) ?? false) ||
    vehicle.make.toLowerCase().includes(q) ||
    vehicle.type.toLowerCase().includes(q) ||
    vehicle.address.toLowerCase().includes(q)
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const trimmed = query.trim()
  const results = trimmed.length >= 2 ? mockVehicles.filter((v) => matchesQuery(v, trimmed)) : []
  const hasQuery = trimmed.length >= 2

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Recherche</h1>
        <p className="text-sm text-muted-foreground">
          Recherchez par plaque, propriétaire, châssis, moteur, NFC, et plus.
        </p>
      </div>

      {/* Search input */}
      <div className="relative mx-auto w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-12 pl-11 pr-4 text-base"
          placeholder="Plaque, propriétaire, châssis, N° impôt, NFC..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="mx-auto w-full max-w-2xl">
        {!hasQuery && (
          <p className="text-center text-sm text-muted-foreground">
            Entrez au moins 2 caractères pour lancer la recherche.
          </p>
        )}

        {hasQuery && results.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="mb-3 text-xs text-muted-foreground">
              {results.length} résultat{results.length > 1 ? "s" : ""} pour{" "}
              <span className="font-medium text-foreground">&ldquo;{trimmed}&rdquo;</span>
            </p>
            {results.map((vehicle) => {
              const status = statusConfig[vehicle.status]
              return (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <PlateBadge
                      province={vehicle.plateProvince}
                      digits={vehicle.plateDigits}
                      letters={vehicle.plateLetters}
                      year={vehicle.plateYear}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium leading-tight">{vehicle.owner}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.make} {vehicle.type} · {vehicle.yearFabrication}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              )
            })}
          </div>
        )}

        {hasQuery && results.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <SearchX className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Aucun résultat</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Aucun véhicule ne correspond à{" "}
                <span className="font-medium text-foreground">&ldquo;{trimmed}&rdquo;</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
