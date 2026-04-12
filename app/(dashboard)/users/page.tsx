"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockUsers } from "./_components/mock-data"
import type { UserStatus } from "./_components/mock-data"
import { UsersTable } from "./_components/users-table"
import { NewUserSheet } from "./_components/new-user-sheet"

type FilterTab = "tous" | UserStatus
const PAGE_SIZE = 10

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<FilterTab>("tous")
  const [page, setPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = useMemo(() => {
    setPage(1)
    return mockUsers.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
      const matchesTab = tab === "tous" || u.status === tab
      return matchesSearch && matchesTab
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const tabs: { value: FilterTab; label: string }[] = [
    { value: "tous", label: "Tous" },
    { value: "actif", label: "Actifs" },
    { value: "inactif", label: "Inactifs" },
  ]

  return (
    <div className="flex flex-col gap-0 p-6">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 pb-5">
        <h1 className="text-xl font-semibold">Utilisateurs</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nom, nom d'utilisateur..."
              className="w-64 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="gap-2" onClick={() => setSheetOpen(true)}>
            <Plus className="size-4" />
            Ajouter un utilisateur
          </Button>
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

      {/* Table */}
      <UsersTable users={paginated} />

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-1 pt-4">
        <p className="text-sm text-muted-foreground">
          Affichage {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length} utilisateurs
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex size-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…")
                acc.push(n)
                return acc
              }, [])
              .map((item, idx) =>
                item === "…" ? (
                  <span key={`e${idx}`} className="flex size-8 items-center justify-center text-sm text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                      item === page
                        ? "bg-foreground text-background font-medium"
                        : "border hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex size-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <NewUserSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
