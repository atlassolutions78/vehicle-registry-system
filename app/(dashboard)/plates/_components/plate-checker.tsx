"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlateBadge } from "@/components/plate-badge"
import { mockPlates, mockVehiclesForAssign, PROVINCES } from "./mock-data"

type CheckResult =
  | { status: "available"; province: string; digits: string; letters: string; year: string }
  | {
      status: "taken"
      province: string
      digits: string
      letters: string
      year: string
      owner: string
      vehicle: string
      usage: string
      assignedAt: string
      vehicleId: string
    }
  | null

function checkPlateAvailability(
  province: string,
  digits: string,
  letters: string,
): CheckResult {
  const found = mockPlates.find(
    (p) =>
      p.province === province &&
      p.digits === digits &&
      p.letters === letters.toUpperCase(),
  )

  if (!found || found.status === "disponible") {
    return {
      status: "available",
      province,
      digits,
      letters: letters.toUpperCase(),
      year: new Date().getFullYear().toString().slice(-2),
    }
  }

  return {
    status: "taken",
    province: found.province,
    digits: found.digits,
    letters: found.letters,
    year: found.year ?? "",
    owner: found.owner ?? "",
    vehicle: found.vehicle ?? "",
    usage: found.usage ?? "",
    assignedAt: found.assignedAt ?? "",
    vehicleId: found.id,
  }
}

export function PlateChecker() {
  const [province, setProvince] = useState("KIN")
  const [digits, setDigits] = useState("")
  const [letters, setLetters] = useState("AA")
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult>(null)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [assigned, setAssigned] = useState(false)

  const isFormValid =
    province.length > 0 &&
    /^\d{4}$/.test(digits) &&
    /^[A-Za-z]{2}$/.test(letters)

  function handleCheck() {
    if (!isFormValid) return
    setChecking(true)
    setResult(null)
    setSelectedVehicle("")
    setAssigned(false)

    // Simulate async check
    setTimeout(() => {
      setResult(checkPlateAvailability(province, digits, letters))
      setChecking(false)
    }, 600)
  }

  function handleAssign() {
    if (!selectedVehicle) return
    setAssigned(true)
  }

  function handleReset() {
    setDigits("")
    setLetters("AA")
    setResult(null)
    setSelectedVehicle("")
    setAssigned(false)
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex flex-col gap-5">
          {/* Form */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Province</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      <span className="font-mono font-semibold">{p.code}</span>
                      <span className="ml-2 text-muted-foreground">{p.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Numéro (4 chiffres)</Label>
              <Input
                className="w-32 font-mono text-base tracking-widest"
                placeholder="0000"
                maxLength={4}
                value={digits}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "")
                  setDigits(v)
                  setResult(null)
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Suffix (2 lettres)</Label>
              <Input
                className="w-24 font-mono text-base uppercase tracking-widest"
                placeholder="AA"
                maxLength={2}
                value={letters}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase()
                  setLetters(v)
                  setResult(null)
                }}
              />
            </div>

            <Button
              onClick={handleCheck}
              disabled={!isFormValid || checking}
              className="gap-2"
            >
              {checking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              Vérifier la disponibilité
            </Button>
          </div>

          {/* Preview while typing */}
          {digits.length > 0 && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">Aperçu :</p>
              <PlateBadge
                province={province}
                digits={digits.padEnd(4, "·")}
                letters={letters.padEnd(2, "·")}
                year={new Date().getFullYear().toString().slice(-2)}
                size="md"
              />
            </div>
          )}

          {/* Result */}
          {result && !assigned && (
            <div
              className={`rounded-xl border p-4 ${
                result.status === "available"
                  ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-900/10"
                  : "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-900/10"
              }`}
            >
              {result.status === "available" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        Plaque disponible
                      </p>
                      <p className="text-sm text-green-700/70 dark:text-green-400/70">
                        Cette plaque peut être attribuée à un véhicule.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <PlateBadge
                      province={result.province}
                      digits={result.digits}
                      letters={result.letters}
                      year={result.year}
                      size="lg"
                    />

                    <div className="flex flex-1 flex-col gap-1.5 min-w-52">
                      <Label>Attribuer à un véhicule</Label>
                      <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVehiclesForAssign.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleAssign}
                      disabled={!selectedVehicle}
                      className="self-end"
                    >
                      Confirmer l'attribution
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">
                        Plaque déjà attribuée
                      </p>
                      <p className="text-sm text-red-700/70 dark:text-red-400/70">
                        Ce numéro est déjà enregistré dans le système.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-6">
                    <PlateBadge
                      province={result.province}
                      digits={result.digits}
                      letters={result.letters}
                      year={result.year}
                      size="lg"
                    />

                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Propriétaire</p>
                        <p className="font-medium">{result.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Usage</p>
                        <p className="font-medium">{result.usage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Véhicule</p>
                        <p className="font-medium">{result.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date d'attribution</p>
                        <p className="font-medium">{result.assignedAt}</p>
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="self-end ml-auto">
                      <Link href={`/vehicles/${result.vehicleId}`}>
                        Voir le véhicule
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success confirmation */}
          {assigned && result?.status === "available" && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800/40 dark:bg-green-900/10">
              <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">
                  Plaque attribuée avec succès !
                </p>
                <p className="mt-1 text-sm text-green-700/70 dark:text-green-400/70">
                  La plaque a été liée au véhicule sélectionné.
                </p>
              </div>
              <PlateBadge
                province={result.province}
                digits={result.digits}
                letters={result.letters}
                year={result.year}
                size="lg"
              />
              <Button variant="outline" size="sm" onClick={handleReset}>
                Vérifier une autre plaque
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
