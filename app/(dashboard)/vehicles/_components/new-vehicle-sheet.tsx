"use client"

import { useState } from "react"
import { Check, CheckCircle2 } from "lucide-react"

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

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setStep(1)
    setData(initial)
    setConfirmed(false)
    onOpenChange(false)
  }

  const plateYear = PROVINCE_YEARS[data.plateProvince]

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

            {/* Step indicator */}
            <div className="flex justify-center border-b px-6 pb-4">
              <StepIndicator current={step} />
            </div>

            {/* Step content */}
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
                      <Input
                        className="font-mono"
                        placeholder="04:A3:2B:1F:9C:00"
                        value={data.nfcUid}
                        onChange={(e) => set("nfcUid", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Laissez vide si la carte NFC n&apos;est pas encore disponible.
                      </p>
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
                </div>
              )}

            </div>

            {/* Footer */}
            <SheetFooter className="flex-row gap-2 border-t px-6 py-4">
              {step > 1 ? (
                <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
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
                <Button className="flex-1" onClick={() => setConfirmed(true)}>
                  Enregistrer
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
              <p className="mt-1 text-sm text-muted-foreground">
                Le véhicule a été ajouté au registre.
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
