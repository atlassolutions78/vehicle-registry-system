import Link from "next/link"
import { Car, CreditCard, Hash, ScanLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RecentRegistrations } from "./_components/recent-registrations"
import { StatsCard } from "./_components/stats-card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenue, Jean-Pierre. Voici l'aperçu du système.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/vehicles/new">
            <Car className="size-4" />
            Enregistrer un véhicule
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Véhicules enregistrés"
          value="1 284"
          description="Total dans le système"
          icon={Car}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Plaques attribuées"
          value="1 284"
          description="Sur 10 000 au total"
          icon={Hash}
        />
        <StatsCard
          title="Plaques disponibles"
          value="8 716"
          description="Prêtes à l'attribution"
          icon={Hash}
          trend={{ value: 3, positive: false }}
        />
        <StatsCard
          title="Cartes NFC liées"
          value="947"
          description="Sur 1 284 véhicules"
          icon={CreditCard}
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Main content + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRegistrations />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">Actions rapides</p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href="/vehicles/new">
                <Car className="size-4" />
                Enregistrer un véhicule
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href="/plates">
                <Hash className="size-4" />
                Attribuer une plaque
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href="/nfc/register">
                <CreditCard className="size-4" />
                Lier une carte NFC
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href="/nfc/verify">
                <ScanLine className="size-4" />
                Vérifier une carte NFC
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
