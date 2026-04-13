"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

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
import { trpc, type RouterOutputs } from "@/lib/trpc/client"
import { toast } from "sonner"

type PlateRow = RouterOutputs["plates"]["list"]["rows"][number]

interface AssignPlateDialogProps {
  plate: PlateRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignPlateDialog({ plate, open, onOpenChange }: AssignPlateDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const utils = trpc.useUtils()

  const { data: vehiclesData } = trpc.vehicles.list.useQuery(
    { withoutPlate: true, limit: 100 },
    { enabled: open },
  )

  const assign = trpc.plates.assignToVehicle.useMutation({
    onSuccess: () => {
      utils.plates.list.invalidate()
      toast.success("Plaque attribuée avec succès")
      setConfirmed(true)
    },
    onError: (err) => toast.error(err.message),
  })

  function handleConfirm() {
    if (!selectedVehicle) return
    assign.mutate({ plateId: plate.id, vehicleId: selectedVehicle })
  }

  function handleClose() {
    setSelectedVehicle("")
    setConfirmed(false)
    assign.reset()
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
                  province={plate.provinceCode}
                  digits={plate.digits}
                  letters={plate.letters}
                  year={plate.year ?? undefined}
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
                    {vehiclesData?.rows.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.owner} — {v.make} {v.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {assign.error && (
                <p className="text-sm text-destructive">{assign.error.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedVehicle || assign.isPending}>
                {assign.isPending ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />En cours…</>
                ) : (
                  "Confirmer l'attribution"
                )}
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
              province={plate.provinceCode}
              digits={plate.digits}
              letters={plate.letters}
              year={plate.year ?? undefined}
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
