import { CreditCard } from "lucide-react"

interface CarteRoseBackData {
  make: string
  type: string
  chassisNumber: string
  engineNumber: string
  yearFabrication: string
  color: string
  fiscalPower: string
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-px border-b border-white/20 pb-1">
      <span className="text-[7px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
      <span className="text-[10px] font-medium text-white">
        {value || <span className="text-white/30">—</span>}
      </span>
    </div>
  )
}

export function CarteRoseBackPreview({ data }: { data: CarteRoseBackData }) {
  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-lg"
      style={{
        aspectRatio: "1.586",
        background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 40%, #a855f7 100%)",
      }}
    >
      {/* Watermark circles */}
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/5" />

      {/* Left accent bar */}
      <div className="absolute bottom-0 left-0 top-0 w-6 bg-yellow-400/80" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col py-3 pl-10 pr-4">
        {/* Header — stays at top */}
        <div className="text-right shrink-0">
          <p className="text-[7px] font-semibold uppercase tracking-widest text-white/70">
            République Démocratique du Congo
          </p>
          <p className="text-[10px] font-black uppercase tracking-wide text-white">
            Identification du Véhicule
          </p>
        </div>

        {/* Spacer — pushes fields to the bottom */}
        <div className="flex-1" />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <PreviewField label="Marque" value={data.make} />
          <PreviewField label="Type / Modèle" value={data.type} />
          <PreviewField label="N° Châssis" value={data.chassisNumber} />
          <PreviewField label="N° Moteur" value={data.engineNumber} />
          <PreviewField label="Année Fabrication" value={data.yearFabrication} />
          <PreviewField label="Couleur" value={data.color} />
          <PreviewField label="Puissance Fiscale" value={data.fiscalPower ? `${data.fiscalPower} CV` : ""} />
        </div>

        {/* NFC chip */}
        <div className="flex justify-end pt-1.5">
          <div className="flex size-9 items-center justify-center rounded-md bg-yellow-400/90">
            <CreditCard className="size-4 text-yellow-900" />
          </div>
        </div>
      </div>
    </div>
  )
}
