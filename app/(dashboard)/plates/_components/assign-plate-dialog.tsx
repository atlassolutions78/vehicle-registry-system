"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlateBadge } from "@/components/plate-badge"
import { mockVehiclesForAssign, type Plate } from "./mock-data"

interface AssignPlateDialogProps {
  plate: Plate
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignPlateDialog({ plate, open, onOpenChange }: AssignPlateDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    if (!selectedVehicle) return
    setConfirmed(true)
  }

  function handleClose() {
    setSelectedVehicle("")
    setConfirmed(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!confirmed ? (
          <>
            <DialogHeader>
              <DialogTitle>Attribuer la plaque</DialogTitle>
              <DialogDescription>
                Sélectionnez le véhicule à associer à cette plaque.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-5 py-2">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">Plaque sélectionnée</p>
                <PlateBadge
                  province={plate.province}
                  digits={plate.digits}
                  letters={plate.letters}
                  size="lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Véhicule</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rechercher un véhicule..." />
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedVehicle}>
                Confirmer l'attribution
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">Plaque attribuée avec succès</p>
              <p className="mt-1 text-sm text-muted-foreground">
                La plaque a été liée au véhicule sélectionné.
              </p>
            </div>
            <PlateBadge
              province={plate.province}
              digits={plate.digits}
              letters={plate.letters}
              size="lg"
            />
            <Button onClick={handleClose} className="mt-2 w-full">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
