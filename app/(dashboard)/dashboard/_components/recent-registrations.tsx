import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentRegistrations = [
  {
    id: "VEH-001",
    plate: "1234",
    owner: "Mbeki Alain",
    vehicle: "Toyota Corolla 2020",
    status: "actif",
    date: "10 jan. 2025",
  },
  {
    id: "VEH-002",
    plate: "5678",
    owner: "Société SAMBU SPRL",
    vehicle: "Isuzu D-Max 2019",
    status: "actif",
    date: "09 jan. 2025",
  },
  {
    id: "VEH-003",
    plate: "9012",
    owner: "Lokuta Marie",
    vehicle: "Honda CR-V 2021",
    status: "en_attente",
    date: "08 jan. 2025",
  },
  {
    id: "VEH-004",
    plate: "3456",
    owner: "Kabila Joseph",
    vehicle: "Land Cruiser 2018",
    status: "actif",
    date: "07 jan. 2025",
  },
  {
    id: "VEH-005",
    plate: "7890",
    owner: "Entreprise KONGO",
    vehicle: "Mercedes Sprinter 2022",
    status: "suspendu",
    date: "06 jan. 2025",
  },
]

const statusConfig = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  en_attente: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  suspendu: { label: "Suspendu", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

export function RecentRegistrations() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Enregistrements récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRegistrations.map((reg) => {
            const status = statusConfig[reg.status as keyof typeof statusConfig]
            return (
              <div
                key={reg.id}
                className="flex items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded border font-mono text-xs font-bold tracking-widest">
                    {reg.plate}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{reg.owner}</p>
                    <p className="truncate text-xs text-muted-foreground">{reg.vehicle}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{reg.date}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
