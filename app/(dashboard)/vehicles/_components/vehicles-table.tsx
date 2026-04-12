"use client"

import Link from "next/link"
import { Car, CreditCard, MoreHorizontal, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlateBadge } from "@/components/plate-badge"
import type { Vehicle } from "./mock-data"

const colorDot: Record<string, string> = {
  Blanc: "bg-gray-100 border border-gray-300",
  Noir: "bg-gray-900",
  Argent: "bg-gray-400",
  Gris: "bg-gray-500",
  Rouge: "bg-red-500",
  Bleu: "bg-blue-500",
  Vert: "bg-green-500",
  Jaune: "bg-yellow-400",
}

const statusConfig = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  en_attente: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  suspendu: { label: "Suspendu", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

interface VehiclesTableProps {
  vehicles: Vehicle[]
}

export function VehiclesTable({ vehicles }: VehiclesTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <Car className="size-8 opacity-40" />
        <p className="text-sm">Aucun véhicule trouvé</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          {/* Side 1 — Propriétaire */}
          <TableHead>N° Plaque</TableHead>
          <TableHead>Nom / Raison Sociale</TableHead>
          <TableHead>N° Impôt</TableHead>
          <TableHead>1ère Circulation</TableHead>
          <TableHead>Usage</TableHead>
          {/* Side 2 — Véhicule */}
          <TableHead>Marque & Type</TableHead>
          <TableHead>Couleur</TableHead>
          <TableHead>Puissance</TableHead>
          {/* System */}
          <TableHead>NFC</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => {
          const status = statusConfig[vehicle.status]
          const dot = colorDot[vehicle.color]
          return (
            <TableRow key={vehicle.id}>
              <TableCell>
                <PlateBadge
                  province={vehicle.plateProvince}
                  digits={vehicle.plateDigits}
                  letters={vehicle.plateLetters}
                  year={vehicle.plateYear}
                  size="sm"
                />
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{vehicle.owner}</p>
                <p className="text-xs text-muted-foreground truncate max-w-48">{vehicle.address}</p>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {vehicle.taxNumber}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {vehicle.firstCirculation}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {vehicle.usage}
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{vehicle.make} {vehicle.type}</p>
                <p className="text-xs text-muted-foreground">Fab. {vehicle.yearFabrication}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`size-3 shrink-0 rounded-full ${dot ?? "bg-muted border"}`} />
                  <span className="text-sm">{vehicle.color}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {vehicle.fiscalPower} CV
              </TableCell>
              <TableCell>
                {vehicle.nfcUid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <CreditCard className="size-3" />
                    Liée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <WifiOff className="size-3" />
                    Non liée
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                  {status.label}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="size-7">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/vehicles/${vehicle.id}`}>Voir la Carte Rose</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    {!vehicle.nfcUid && (
                      <DropdownMenuItem>Lier une carte NFC</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      Suspendre
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
