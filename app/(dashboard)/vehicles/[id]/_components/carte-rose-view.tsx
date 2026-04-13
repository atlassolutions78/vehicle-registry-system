import { CreditCard } from "lucide-react"

import { PlateBadge } from "@/components/plate-badge"
import type { RouterOutputs } from "@/lib/trpc/client"

type VehicleDetail = RouterOutputs["vehicles"]["byId"]

interface CarteRoseViewProps {
  vehicle: VehicleDetail
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-px border-b border-white/20 pb-1.5">
      <span className="text-[7px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
      <span className="text-[10px] font-medium text-white">{value}</span>
    </div>
  )
}

export function CarteRoseView({ vehicle }: CarteRoseViewProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl items-stretch gap-4 sm:grid-cols-2">
      {/* ── Face 1 — Propriétaire ── */}
      <div className="flex flex-col gap-2 h-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Face 1 — Propriétaire
        </p>
        <div
          className="relative flex flex-1 flex-col overflow-hidden rounded-xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 40%, #a855f7 100%)" }}
        >
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/5" />
          <div className="absolute right-16 top-8 size-20 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 top-0 w-6 bg-yellow-400/80" />

          <div className="flex flex-col gap-3 py-4 pl-10 pr-4">
            <div className="text-right">
              <p className="text-[7px] font-semibold uppercase tracking-widest text-white/70">
                République Démocratique du Congo
              </p>
              <p className="text-[10px] font-black uppercase tracking-wide text-white">
                Certificat d&apos;Immatriculation
              </p>
              <p className="text-[8px] text-white/70">Identification du Propriétaire</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="col-span-2">
                <Field label="Nom ou Raison Sociale" value={vehicle.owner} />
              </div>
              <div className="col-span-2">
                <Field label="Adresse" value={vehicle.address} />
              </div>
              <Field label="Numéro Impôt" value={vehicle.taxNumber} />
              <Field label="Usage" value={vehicle.usage} />
              <div className="col-span-2">
                <Field label="1ère Circulation" value={vehicle.firstCirculation} />
              </div>
              <div className="col-span-2 flex flex-col gap-px border-b border-white/20 pb-1.5">
                <span className="text-[7px] font-semibold uppercase tracking-widest text-white/60">
                  Numéro Plaque
                </span>
                {vehicle.plateProvinceCode ? (
                  <PlateBadge
                    province={vehicle.plateProvinceCode}
                    digits={vehicle.plateDigits ?? ""}
                    letters={vehicle.plateLetters ?? ""}
                    year={vehicle.plateYear ?? undefined}
                    size="sm"
                  />
                ) : (
                  <span className="text-[10px] text-white/50">Non attribuée</span>
                )}
              </div>
            </div>

            <div className="flex justify-end text-xl">🇨🇩</div>
          </div>
        </div>
      </div>

      {/* ── Face 2 — Véhicule ── */}
      <div className="flex flex-col gap-2 h-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Face 2 — Véhicule
        </p>
        <div
          className="relative flex flex-1 flex-col overflow-hidden rounded-xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 40%, #a855f7 100%)" }}
        >
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 top-0 w-6 bg-yellow-400/80" />

          <div className="flex flex-col gap-3 py-4 pl-10 pr-4">
            <div className="text-right">
              <p className="text-[7px] font-semibold uppercase tracking-widest text-white/70">
                République Démocratique du Congo
              </p>
              <p className="text-[10px] font-black uppercase tracking-wide text-white">
                Identification du Véhicule
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Field label="Marque" value={vehicle.make} />
              <Field label="Type / Modèle" value={vehicle.type} />
              <Field label="N° Châssis" value={vehicle.chassisNumber} />
              <Field label="N° Moteur" value={vehicle.engineNumber} />
              <Field label="Année Fabrication" value={vehicle.yearFabrication} />
              <Field label="Couleur" value={vehicle.color} />
              <Field label="Puissance Fiscale" value={`${vehicle.fiscalPower} CV`} />
            </div>

            <div className="flex justify-end">
              <div className="flex size-9 items-center justify-center rounded-md bg-yellow-400/90">
                <CreditCard className="size-4 text-yellow-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
