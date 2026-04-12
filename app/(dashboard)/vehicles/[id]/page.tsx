import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Pencil, Printer, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlateBadge } from "@/components/plate-badge"
import { mockVehicles } from "../_components/mock-data"
import { CarteRoseView } from "./_components/carte-rose-view"

const statusConfig = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  en_attente: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  suspendu: { label: "Suspendu", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicle = mockVehicles.find((v) => v.id === id)
  if (!vehicle) notFound()

  const status = statusConfig[vehicle.status]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back + Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
            <Link href="/vehicles">
              <ArrowLeft className="size-4" />
              Retour aux véhicules
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <PlateBadge
                province={vehicle.plateProvince}
                digits={vehicle.plateDigits}
                letters={vehicle.plateLetters}
                year={vehicle.plateYear}
                size="lg"
              />
            <div>
              <h1 className="text-xl font-semibold">{vehicle.owner}</h1>
              <p className="text-sm text-muted-foreground">
                {vehicle.make} {vehicle.type} · {vehicle.yearFabrication}
              </p>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="size-4" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Info cards + NFC */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Owner */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Propriétaire</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Nom / Raison Sociale" value={vehicle.owner} />
            <DetailRow label="Adresse" value={vehicle.address} />
            <DetailRow label="Numéro Impôt" value={vehicle.taxNumber} />
          </CardContent>
        </Card>

        {/* Vehicle info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informations du véhicule</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Usage" value={vehicle.usage} />
            <DetailRow label="1ère mise en circulation" value={vehicle.firstCirculation} />
            <DetailRow
              label="Numéro de plaque"
              value={`${vehicle.plateProvince} ${vehicle.plateDigits} ${vehicle.plateLetters} ${vehicle.plateYear}`}
            />
          </CardContent>
        </Card>

        {/* Technical */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Données techniques</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Marque & Type" value={`${vehicle.make} ${vehicle.type}`} />
            <DetailRow label="N° Châssis" value={vehicle.chassisNumber} />
            <DetailRow label="N° Moteur" value={vehicle.engineNumber} />
            <DetailRow label="Année de fabrication" value={vehicle.yearFabrication} />
            <DetailRow label="Couleur" value={vehicle.color} />
            <DetailRow label="Puissance fiscale" value={`${vehicle.fiscalPower} CV`} />
          </CardContent>
        </Card>
      </div>

      {/* NFC status */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-3">
            <div className={`flex size-10 items-center justify-center rounded-lg ${vehicle.nfcUid ? "bg-blue-100 dark:bg-blue-900/30" : "bg-muted"}`}>
              {vehicle.nfcUid ? (
                <CreditCard className="size-5 text-blue-700 dark:text-blue-400" />
              ) : (
                <WifiOff className="size-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {vehicle.nfcUid ? "Carte NFC liée" : "Aucune carte NFC"}
              </p>
              {vehicle.nfcUid ? (
                <p className="font-mono text-xs text-muted-foreground">{vehicle.nfcUid}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Ce véhicule n'a pas encore de carte NFC associée.
                </p>
              )}
            </div>
          </div>
          {!vehicle.nfcUid && (
            <Button size="sm" variant="outline" disabled>
              <CreditCard className="size-4" />
              Lier lors de la modification
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Carte Rose preview */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Aperçu Carte Rose</h2>
        <CarteRoseView vehicle={vehicle} />
      </div>
    </div>
  )
}
