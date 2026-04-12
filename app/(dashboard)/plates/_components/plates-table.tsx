"use client"

import { useState } from "react"
import { Car, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { AssignPlateDialog } from "./assign-plate-dialog"
import type { Plate } from "./mock-data"

interface PlatesTableProps {
  plates: Plate[]
}

export function PlatesTable({ plates }: PlatesTableProps) {
  const [assignTarget, setAssignTarget] = useState<Plate | null>(null)

  if (plates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <Car className="size-8 opacity-40" />
        <p className="text-sm">Aucune plaque trouvée</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Plaque</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Propriétaire</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Date d&apos;attribution</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {plates.map((plate) => (
            <TableRow key={plate.id}>
              <TableCell>
                <PlateBadge
                  province={plate.province}
                  digits={plate.digits}
                  letters={plate.letters}
                  year={plate.year}
                  size="sm"
                />
              </TableCell>
              <TableCell>
                {plate.status === "attribuee" ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Attribuée
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Disponible
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {plate.owner ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {plate.vehicle ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {plate.usage ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {plate.assignedAt ?? "—"}
              </TableCell>
              <TableCell>
                {plate.status === "disponible" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={() => setAssignTarget(plate)}
                  >
                    <Plus className="size-3" />
                    Attribuer
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-7">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir le véhicule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Libérer la plaque
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {assignTarget && (
        <AssignPlateDialog
          plate={assignTarget}
          open={!!assignTarget}
          onOpenChange={(open) => { if (!open) setAssignTarget(null) }}
        />
      )}
    </>
  )
}
