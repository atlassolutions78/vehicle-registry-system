"use client"

import { useState } from "react"
import { Check, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { CarteRoseFrontPreview } from "../new/_components/carte-rose-front-preview"
import { CarteRoseBackPreview } from "../new/_components/carte-rose-back-preview"
import { trpc } from "@/lib/trpc/client"

const PROVINCE_YEARS: Record<string, string> = { NKV: "19", SKV: "22" }
const USAGE_OPTIONS = ["Privé", "Commercial", "Officiel", "Diplomatique"]
const COLOR_OPTIONS = ["Blanc", "Noir", "Argent", "Gris", "Rouge", "Bleu", "Vert", "Jaune", "Marron"]

interface FormData {
  owner: string
  address: string
  taxNumber: string
  usage: string
  firstCirculation: string
  plateProvince: string
  plateDigits: string
  plateLetters: string
  make: string
  type: string
  chassisNumber: string
  engineNumber: string
  yearFabrication: string
  color: string
  fiscalPower: string
  nfcUid: string
}

const initial: FormData = {
  owner: "", address: "", taxNumber: "", usage: "", firstCirculation: "",
  plateProvince: "NKV", plateDigits: "", plateLetters: "",
  make: "", type: "", chassisNumber: "", engineNumber: "",
  yearFabrication: "", color: "", fiscalPower: "", nfcUid: "",
}

const STEPS = [
  { num: 1, label: "Propriétaire" },
  { num: 2, label: "Véhicule" },
  { num: 3, label: "Confirmation" },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              current > step.num
                ? "bg-foreground text-background"
                : current === step.num
                ? "bg-foreground text-background"
                : "border-2 border-muted-foreground/30 text-muted-foreground"
            }`}>
              {current > step.num ? <Check className="size-3" /> : step.num}
            </div>
            <span className={`text-[10px] ${current === step.num ? "font-medium" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`mb-4 h-px w-12 transition-colors ${current > idx + 1 ? "bg-foreground" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

interface NewVehicleSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewVehicleSheet({ open, onOpenChange }: NewVehicleSheetProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initial)
  const [confirmed, setConfirmed] = useState(false)
  const utils = trpc.useUtils()

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const plateYear = PROVINCE_YEARS[data.plateProvince]

  // Live plate availability check
  const isValidPlateInput = /^\d{4}$/.test(data.plateDigits) && /^[A-Za-z]{2}$/.test(data.plateLetters)
  const { data: foundPlate } = trpc.plates.check.useQuery(
    { provinceCode: data.plateProvince, digits: data.plateDigits, letters: data.plateLetters.toUpperCase() },
    { enabled: open && isValidPlateInput },
  )

  const createVehicle = trpc.vehicles.create.useMutation()
  const assignToVehicle = trpc.plates.assignToVehicle.useMutation()

  const isPending = createVehicle.isPending || assignToVehicle.isPending
  const error = createVehicle.error?.message ?? assignToVehicle.error?.message

  const step1Valid =
    data.owner.trim() &&
    data.address.trim() &&
    data.taxNumber.trim() &&
    data.usage &&
    data.firstCirculation.trim()

  const step2Valid =
    data.make.trim() &&
    data.type.trim() &&
    data.chassisNumber.trim() &&
    data.engineNumber.trim() &&
    data.yearFabrication.trim() &&
    data.color &&
    data.fiscalPower.trim()

  async function handleSubmit() {
    try {
      const newVehicle = await createVehicle.mutateAsync({
        owner: data.owner,
        address: data.address,
        taxNumber: data.taxNumber,
        usage: data.usage,
        firstCirculation: parseInt(data.firstCirculation),
        make: data.make,
        type: data.type,
        chassisNumber: data.chassisNumber,
        engineNumber: data.engineNumber,
        yearFabrication: parseInt(data.yearFabrication),
        color: data.color,
        fiscalPower: parseInt(data.fiscalPower),
        nfcUid: data.nfcUid || undefined,
      })

      // Link the plate if one was specified and is available
      if (foundPlate?.id && foundPlate.status === "disponible") {
        await assignToVehicle.mutateAsync({ plateId: foundPlate.id, vehicleId: newVehicle.id })
      }

      utils.vehicles.list.invalidate()
      utils.plates.list.invalidate()
      toast.success("Véhicule enregistré avec succès")
      setConfirmed(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  function handleClose() {
    setStep(1)
    setData(initial)
    setConfirmed(false)
    createVehicle.reset()
    assignToVehicle.reset()
    onOpenChange(false)
  }

  // Plate status indicator
  const plateStatusEl = isValidPlateInput && foundPlate !== undefined ? (
    foundPlate === null ? (
      <p className="text-xs text-muted-foreground">Plaque introuvable dans le système — elle sera créée sans plaque.</p>
    ) : foundPlate.status === "disponible" ? (
      <p className="text-xs text-green-600">Plaque disponible — sera attribuée automatiquement.</p>
    ) : (
      <p className="text-xs text-destructive">Plaque déjà attribuée à {foundPlate.owner ?? "un autre véhicule"}.</p>
    )
  ) : null

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-2xl">
        {!confirmed ? (
          <>
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle>Enregistrer un véhicule</SheetTitle>
              <SheetDescription>
                {step === 1 && "Renseignez les informations du propriétaire."}
                {step === 2 && "Renseignez les données techniques du véhicule."}
                {step === 3 && "Vérifiez les deux faces avant de soumettre."}
              </SheetDescription>
            </SheetHeader>

            <div className="flex justify-center border-b px-6 pb-4">
              <StepIndicator current={step} />
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">

              {/* ── Step 1 ── */}
              {step === 1 && (
                <>
                  <CarteRoseFrontPreview data={{ ...data, plateYear }} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label>Nom ou Raison Sociale *</Label>
                      <Input placeholder="Jean Mbeki ou Société SAMBU SPRL" value={data.owner} onChange={(e) => set("owner", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label>Adresse *</Label>
                      <Textarea placeholder="Av. Kasa-Vubu, N°14, Commune de Lingwala..." rows={2} value={data.address} onChange={(e) => set("address", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Numéro Impôt *</Label>
                      <Input placeholder="A1234567B" value={data.taxNumber} onChange={(e) => set("taxNumber", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Usage *</Label>
                      <Select value={data.usage} onValueChange={(v) => set("usage", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                        <SelectContent>
                          {USAGE_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Année 1ère Circulation *</Label>
                      <Input type="number" placeholder="2020" min={1950} max={new Date().getFullYear()} value={data.firstCirculation} onChange={(e) => set("firstCirculation", e.target.value)} />
                    </div>
                    {/* <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label>Numéro de plaque <span className="font-normal text-muted-foreground">(optionnel)</span></Label>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Province</span>
                          <Select value={data.plateProvince} onValueChange={(v) => set("plateProvince", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NKV"><span className="font-mono font-semibold">NKV</span><span className="ml-2 text-muted-foreground">Nord-Kivu</span></SelectItem>
                              <SelectItem value="SKV"><span className="font-mono font-semibold">SKV</span><span className="ml-2 text-muted-foreground">Sud-Kivu</span></SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Numéro</span>
                          <Input className="font-mono tracking-widest" placeholder="0000" maxLength={4} value={data.plateDigits} onChange={(e) => set("plateDigits", e.target.value.replace(/\D/g, ""))} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Suffixe</span>
                          <Input className="font-mono uppercase tracking-widest" placeholder="AA" maxLength={2} value={data.plateLetters} onChange={(e) => set("plateLetters", e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Année</span>
                          <Input className="font-mono bg-muted text-muted-foreground" readOnly value={plateYear} />
                        </div>
                      </div>
                      {plateStatusEl}
                    </div> */}
                  </div>
                </>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <>
                  <CarteRoseBackPreview data={data} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>Marque *</Label>
                      <Input placeholder="Toyota, Mercedes..." value={data.make} onChange={(e) => set("make", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Type / Modèle *</Label>
                      <Input placeholder="Corolla, Sprinter..." value={data.type} onChange={(e) => set("type", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>N° Châssis *</Label>
                      <Input className="font-mono" placeholder="JTDBL40E099123456" value={data.chassisNumber} onChange={(e) => set("chassisNumber", e.target.value.toUpperCase())} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>N° Moteur *</Label>
                      <Input className="font-mono" placeholder="2ZR9834521" value={data.engineNumber} onChange={(e) => set("engineNumber", e.target.value.toUpperCase())} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Année de fabrication *</Label>
                      <Input type="number" placeholder="2020" min={1950} max={new Date().getFullYear()} value={data.yearFabrication} onChange={(e) => set("yearFabrication", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Couleur *</Label>
                      <Select value={data.color} onValueChange={(v) => set("color", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Puissance Fiscale (CV) *</Label>
                      <Input type="number" placeholder="7" min={1} value={data.fiscalPower} onChange={(e) => set("fiscalPower", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label>UID Carte NFC <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
                      <Input className="font-mono" placeholder="04:A3:2B:1F:9C:00" value={data.nfcUid} onChange={(e) => set("nfcUid", e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Face 1 — Propriétaire</p>
                    <CarteRoseFrontPreview data={{ ...data, plateYear }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Face 2 — Véhicule</p>
                    <CarteRoseBackPreview data={data} />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}

            </div>

            <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
              {step > 1 ? (
                <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)} disabled={isPending}>
                  ← Retour
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Annuler
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="flex-1"
                  disabled={step === 1 ? !step1Valid : !step2Valid}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Suivant →
                </Button>
              ) : (
                <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? <><Loader2 className="size-4 animate-spin" />En cours…</> : "Enregistrer"}
                </Button>
              )}
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">Véhicule enregistré !</p>
              <p className="mt-1 text-sm text-muted-foreground">Le véhicule a été ajouté au registre.</p>
            </div>
            <Button variant="outline" onClick={handleClose}>Fermer</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
