interface CarteRoseFrontData {
  owner: string
  address: string
  taxNumber: string
  usage: string
  firstCirculation: string
  plateProvince: string
  plateDigits: string
  plateLetters: string
  plateYear: string
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

export function CarteRoseFrontPreview({ data }: { data: CarteRoseFrontData }) {
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
      <div className="absolute right-16 top-8 size-20 rounded-full bg-white/5" />

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
            Certificat d&apos;Immatriculation
          </p>
          <p className="text-[8px] text-white/70">Identification du Propriétaire</p>
        </div>

        {/* Spacer — pushes fields to the bottom */}
        <div className="flex-1" />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="col-span-2">
            <PreviewField label="Nom ou Raison Sociale" value={data.owner} />
          </div>
          <div className="col-span-2">
            <PreviewField label="Adresse" value={data.address} />
          </div>
          <PreviewField label="Numéro Impôt" value={data.taxNumber} />
          <PreviewField label="Usage" value={data.usage} />
          <div className="col-span-2">
            <PreviewField label="1ère Circulation" value={data.firstCirculation} />
          </div>
          <div className="col-span-2 flex flex-col gap-px border-b border-white/20 pb-1">
            <span className="text-[7px] font-semibold uppercase tracking-widest text-white/60">
              Numéro Plaque
            </span>
            {/* <PlateBadge
              province={data.plateProvince}
              digits={data.plateDigits || "····"}
              letters={data.plateLetters || "··"}
              year={data.plateYear}
              size="sm"
            /> */}
          </div>
        </div>

        {/* DRC Flag */}
        <div className="flex justify-end pt-1.5 text-xl">🇨🇩</div>
      </div>
    </div>
  )
}
