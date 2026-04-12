"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CheckCircle } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { CarteRoseFrontPreview } from "./_components/carte-rose-front-preview"
import { CarteRoseBackPreview } from "./_components/carte-rose-back-preview"

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
}

const initial: FormData = {
  owner: "", address: "", taxNumber: "", usage: "", firstCirculation: "",
  plateProvince: "NKV", plateDigits: "", plateLetters: "",
  make: "", type: "", chassisNumber: "", engineNumber: "",
  yearFabrication: "", color: "", fiscalPower: "",
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
            <div
              className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                current > step.num
                  ? "bg-foreground text-background"
                  : current === step.num
                  ? "bg-foreground text-background"
                  : "border-2 border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {current > step.num ? <Check className="size-4" /> : step.num}
            </div>
            <span
              className={`text-xs ${
                current === step.num ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`mb-5 h-px w-20 transition-colors ${
                current > idx + 1 ? "bg-foreground" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function NewVehiclePage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initial)
  const [submitted, setSubmitted] = useState(false)

  function set(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const plateYear = PROVINCE_YEARS[data.plateProvince]

  const step1Valid =
    data.owner.trim() &&
    data.address.trim() &&
    data.taxNumber.trim() &&
    data.usage &&
    data.firstCirculation.trim() &&
    /^\d{4}$/.test(data.plateDigits) &&
    /^[A-Za-z]{2}$/.test(data.plateLetters)

  const step2Valid =
    data.make.trim() &&
    data.type.trim() &&
    data.chassisNumber.trim() &&
    data.engineNumber.trim() &&
    data.yearFabrication.trim() &&
    data.color &&
    data.fiscalPower.trim()

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Véhicule enregistré avec succès</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Le véhicule a été ajouté au registre. Vous pouvez maintenant lui attribuer une carte NFC.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/vehicles">Voir tous les véhicules</Link>
          </Button>
          <Button onClick={() => { setData(initial); setStep(1); setSubmitted(false) }}>
            Enregistrer un autre
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Back + title */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
          <Link href="/vehicles">
            <ArrowLeft className="size-4" />
            Retour aux véhicules
          </Link>
        </Button>
        <h1 className="mt-2 text-xl font-semibold">Enregistrer un véhicule</h1>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <CarteRoseFrontPreview
            data={{ ...data, plateYear }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Nom ou Raison Sociale *</Label>
              <Input
                placeholder="Ex : Jean Mbeki ou Société SAMBU SPRL"
                value={data.owner}
                onChange={(e) => set("owner", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Adresse *</Label>
              <Textarea
                placeholder="Av. Kasa-Vubu, N°14, Commune de Lingwala, Kinshasa"
                rows={2}
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Numéro Impôt *</Label>
              <Input
                placeholder="A1234567B"
                value={data.taxNumber}
                onChange={(e) => set("taxNumber", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Usage *</Label>
              <Select value={data.usage} onValueChange={(v) => set("usage", v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {USAGE_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Année 1ère Circulation *</Label>
              <Input
                type="number"
                placeholder="2020"
                min={1950}
                max={new Date().getFullYear()}
                value={data.firstCirculation}
                onChange={(e) => set("firstCirculation", e.target.value)}
              />
            </div>

            {/* Plate */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Numéro de plaque *</Label>
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Province</span>
                  <Select value={data.plateProvince} onValueChange={(v) => set("plateProvince", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NKV">
                        <span className="font-mono font-semibold">NKV</span>
                        <span className="ml-2 text-muted-foreground">Nord-Kivu</span>
                      </SelectItem>
                      <SelectItem value="SKV">
                        <span className="font-mono font-semibold">SKV</span>
                        <span className="ml-2 text-muted-foreground">Sud-Kivu</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Numéro</span>
                  <Input
                    className="font-mono tracking-widest"
                    placeholder="0000"
                    maxLength={4}
                    value={data.plateDigits}
                    onChange={(e) => set("plateDigits", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Suffixe</span>
                  <Input
                    className="font-mono uppercase tracking-widest"
                    placeholder="AA"
                    maxLength={2}
                    value={data.plateLetters}
                    onChange={(e) => set("plateLetters", e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Année</span>
                  <Input
                    className="font-mono bg-muted text-muted-foreground"
                    readOnly
                    value={plateYear}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!step1Valid}>
              Suivant →
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <CarteRoseBackPreview data={data} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Marque *</Label>
              <Input
                placeholder="Toyota, Mercedes, Ford..."
                value={data.make}
                onChange={(e) => set("make", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type / Modèle *</Label>
              <Input
                placeholder="Corolla, Sprinter, Transit..."
                value={data.type}
                onChange={(e) => set("type", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>N° Châssis *</Label>
              <Input
                className="font-mono"
                placeholder="JTDBL40E099123456"
                value={data.chassisNumber}
                onChange={(e) => set("chassisNumber", e.target.value.toUpperCase())}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>N° Moteur *</Label>
              <Input
                className="font-mono"
                placeholder="2ZR9834521"
                value={data.engineNumber}
                onChange={(e) => set("engineNumber", e.target.value.toUpperCase())}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Année de fabrication *</Label>
              <Input
                type="number"
                placeholder="2020"
                min={1950}
                max={new Date().getFullYear()}
                value={data.yearFabrication}
                onChange={(e) => set("yearFabrication", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Couleur *</Label>
              <Select value={data.color} onValueChange={(v) => set("color", v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Puissance Fiscale (CV) *</Label>
              <Input
                type="number"
                placeholder="7"
                min={1}
                value={data.fiscalPower}
                onChange={(e) => set("fiscalPower", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              ← Retour
            </Button>
            <Button onClick={() => setStep(3)} disabled={!step2Valid}>
              Suivant →
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3 — Confirmation ── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            Vérifiez les informations avant de soumettre. Les deux faces de la Carte Rose sont générées à partir de vos saisies.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Face 1 — Propriétaire
              </p>
              <CarteRoseFrontPreview data={{ ...data, plateYear }} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Face 2 — Véhicule
              </p>
              <CarteRoseBackPreview data={data} />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              ← Retour
            </Button>
            <Button onClick={() => setSubmitted(true)}>
              Enregistrer le véhicule
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
