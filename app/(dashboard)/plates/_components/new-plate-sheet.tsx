"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

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
import { PlateBadge } from "@/components/plate-badge"
import { trpc } from "@/lib/trpc/client"
import { toast } from "sonner"

interface NewPlateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PROVINCE_YEARS: Record<string, string> = {
  NKV: "19",
  SKV: "22",
}

const SHEET_PROVINCES = [
  { code: "NKV", name: "Nord-Kivu" },
  { code: "SKV", name: "Sud-Kivu" },
]

export function NewPlateSheet({ open, onOpenChange }: NewPlateSheetProps) {
  const [province, setProvince] = useState("NKV")
  const [digits, setDigits] = useState("")
  const [letters, setLetters] = useState("")
  const year = PROVINCE_YEARS[province]
  const [vehicleId, setVehicleId] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const utils = trpc.useUtils()

  const { data: vehiclesData } = trpc.vehicles.list.useQuery(
    { withoutPlate: true, limit: 100 },
    { enabled: open },
  )

  const createPlate = trpc.plates.create.useMutation()
  const assignToVehicle = trpc.plates.assignToVehicle.useMutation()

  const isValid =
    province.length > 0 &&
    /^\d{4}$/.test(digits) &&
    /^[A-Za-z]{2}$/.test(letters)

  const isPending = createPlate.isPending || assignToVehicle.isPending
  const error = createPlate.error?.message ?? assignToVehicle.error?.message

  async function handleConfirm() {
    if (!isValid) return
    try {
      const newPlate = await createPlate.mutateAsync({
        provinceCode: province,
        digits,
        letters: letters.toUpperCase(),
        year,
      })
      if (vehicleId) {
        await assignToVehicle.mutateAsync({ plateId: newPlate.id, vehicleId })
      }
      utils.plates.list.invalidate()
      toast.success(vehicleId ? "Plaque attribuée avec succès" : "Plaque enregistrée avec succès")
      setConfirmed(true)
    } catch {
      // error shown via mutation error state
    }
  }

  function handleClose() {
    setProvince("NKV")
    setDigits("")
    setLetters("")
    setVehicleId("")
    setConfirmed(false)
    createPlate.reset()
    assignToVehicle.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        {!confirmed ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle>Nouvelle plaque</SheetTitle>
              <SheetDescription>
                Renseignez les détails de la plaque puis associez-la à un véhicule ou enregistrez-la comme disponible.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-4">
              {/* Live preview */}
              <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 py-6">
                <p className="text-xs text-muted-foreground">Aperçu</p>
                <PlateBadge
                  province={province}
                  digits={digits.padEnd(4, "·")}
                  letters={letters.padEnd(2, "·")}
                  year={year || "··"}
                  size="lg"
                />
              </div>

              {/* Plate fields */}
              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Détails de la plaque
                </p>

                <div className="flex flex-col gap-2">
                  <Label>Province</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHEET_PROVINCES.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          <span className="font-mono font-semibold">{p.code}</span>
                          <span className="ml-2 text-muted-foreground">{p.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Numéro</Label>
                    <Input
                      className="font-mono tracking-widest"
                      placeholder="0000"
                      maxLength={4}
                      value={digits}
                      onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Suffixe</Label>
                    <Input
                      className="font-mono uppercase tracking-widest"
                      placeholder="AA"
                      maxLength={2}
                      value={letters}
                      onChange={(e) =>
                        setLetters(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Année</Label>
                    <Input
                      className="font-mono tracking-widest bg-muted text-muted-foreground"
                      readOnly
                      value={year}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle assignment */}
              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Affectation (optionnel)
                </p>
                <div className="flex flex-col gap-2">
                  <Label>Véhicule</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Laisser disponible…" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiclesData?.rows.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.owner} — {v.make} {v.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour enregistrer la plaque comme disponible.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isPending}>
                Annuler
              </Button>
              <Button className="flex-1 gap-2" disabled={!isValid || isPending} onClick={handleConfirm}>
                {isPending ? (
                  <><Loader2 className="size-4 animate-spin" />En cours…</>
                ) : (
                  vehicleId ? "Attribuer" : "Enregistrer"
                )}
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">
                {vehicleId ? "Plaque attribuée !" : "Plaque enregistrée !"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {vehicleId
                  ? "La plaque a été liée au véhicule sélectionné."
                  : "La plaque est maintenant disponible dans le système."}
              </p>
            </div>
            <PlateBadge
              province={province}
              digits={digits}
              letters={letters}
              year={year}
              size="lg"
            />
            <Button variant="outline" onClick={handleClose} className="mt-2">
              Fermer
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
