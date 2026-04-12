"use client"

import { useMemo, useState } from "react"
import { Car, CreditCard, Hash, Pencil, Search, ScanLine, UserCheck, UserPlus, UserX } from "lucide-react"

import { Input } from "@/components/ui/input"
import { mockAuditLog, actionEntityMap, type ActionType, type EntityType } from "./_components/mock-data"

type FilterTab = "tous" | EntityType

const actionConfig: Record<ActionType, {
  icon: React.ElementType
  colorBg: string
  colorIcon: string
}> = {
  vehicule_enregistre: { icon: Car,       colorBg: "bg-green-100 dark:bg-green-900/30",  colorIcon: "text-green-600 dark:text-green-400" },
  vehicule_modifie:    { icon: Pencil,    colorBg: "bg-blue-100 dark:bg-blue-900/30",    colorIcon: "text-blue-600 dark:text-blue-400" },
  vehicule_suspendu:   { icon: Car,       colorBg: "bg-red-100 dark:bg-red-900/30",      colorIcon: "text-red-600 dark:text-red-400" },
  vehicule_active:     { icon: Car,       colorBg: "bg-green-100 dark:bg-green-900/30",  colorIcon: "text-green-600 dark:text-green-400" },
  plaque_creee:        { icon: Hash,      colorBg: "bg-green-100 dark:bg-green-900/30",  colorIcon: "text-green-600 dark:text-green-400" },
  plaque_attribuee:    { icon: Hash,      colorBg: "bg-blue-100 dark:bg-blue-900/30",    colorIcon: "text-blue-600 dark:text-blue-400" },
  utilisateur_cree:    { icon: UserPlus,  colorBg: "bg-green-100 dark:bg-green-900/30",  colorIcon: "text-green-600 dark:text-green-400" },
  utilisateur_desactive:{ icon: UserX,   colorBg: "bg-red-100 dark:bg-red-900/30",      colorIcon: "text-red-600 dark:text-red-400" },
  utilisateur_active:  { icon: UserCheck, colorBg: "bg-green-100 dark:bg-green-900/30",  colorIcon: "text-green-600 dark:text-green-400" },
  nfc_verifie:         { icon: ScanLine,  colorBg: "bg-purple-100 dark:bg-purple-900/30",colorIcon: "text-purple-600 dark:text-purple-400" },
  nfc_lie:             { icon: CreditCard,colorBg: "bg-blue-100 dark:bg-blue-900/30",    colorIcon: "text-blue-600 dark:text-blue-400" },
}

const tabs: { value: FilterTab; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "vehicule", label: "Véhicules" },
  { value: "plaque", label: "Plaques" },
  { value: "utilisateur", label: "Utilisateurs" },
  { value: "nfc", label: "NFC" },
]

export default function AuditPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<FilterTab>("tous")

  const filtered = useMemo(() => {
    return mockAuditLog.filter((entry) => {
      const matchesTab = tab === "tous" || actionEntityMap[entry.action] === tab
      const matchesSearch =
        search === "" ||
        entry.user.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.user.username.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [search, tab])

  return (
    <div className="flex flex-col gap-0 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-5">
        <div>
          <h1 className="text-xl font-semibold">Journal d&apos;activité</h1>
          <p className="text-sm text-muted-foreground">Historique de toutes les actions effectuées dans le système.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Utilisateur, action..."
            className="w-64 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`pb-3 text-sm transition-colors ${
                tab === t.value
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Feed */}
      <div className="py-4">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Aucune entrée trouvée.
          </p>
        ) : (
          <div className="flex flex-col">
            {filtered.map((entry, idx) => {
              const config = actionConfig[entry.action]
              const Icon = config.icon
              const isLast = idx === filtered.length - 1

              return (
                <div key={entry.id} className="flex gap-4">
                  {/* Icon + vertical line */}
                  <div className="flex flex-col items-center">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.colorBg}`}>
                      <Icon className={`size-3.5 ${config.colorIcon}`} />
                    </div>
                    {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
                  </div>

                  {/* Content */}
                  <div className={`flex flex-1 flex-col gap-0.5 pb-5 ${isLast ? "" : ""}`}>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{entry.user.name}</span>
                        {" "}
                        <span className="text-muted-foreground">{entry.description}</span>
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @{entry.user.username} · {entry.user.role}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
