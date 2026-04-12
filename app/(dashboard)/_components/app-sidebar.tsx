"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Car,
  ChevronRight,
  ClipboardList,
  Hash,
  LayoutDashboard,
  LogOut,
  MapPin,
  ScanLine,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navGroups = [
  {
    label: "Carte NFC",
    items: [
      { title: "Vérifier NFC", href: "/nfc/verify", icon: ScanLine },
    ],
  },
  {
    label: "Système",
    items: [
      { title: "Recherche", href: "/search", icon: Search },
      { title: "Utilisateurs", href: "/users", icon: Users },
      { title: "Journal d'activité", href: "/audit", icon: ClipboardList },
    ],
  },
]

const platesSubItems = [
  { title: "Toutes les plaques", href: "/plates" },
  { title: "Nord-Kivu", href: "/plates/nord-kivu" },
  { title: "Sud-Kivu", href: "/plates/sud-kivu" },
]

const vehiclesSubItems = [
  { title: "Tous les véhicules", href: "/vehicles" },
  { title: "Nord-Kivu", href: "/vehicles/nord-kivu" },
  { title: "Sud-Kivu", href: "/vehicles/sud-kivu" },
]

const mockUser = {
  name: "Jean-Pierre Kalala",
  username: "jp.kalala",
  role: "ADMIN",
  initials: "JK",
}

export function AppSidebar() {
  const pathname = usePathname()
  const [platesOpen, setPlatesOpen] = useState(() => pathname.startsWith("/plates"))
  const [vehiclesOpen, setVehiclesOpen] = useState(() => pathname.startsWith("/vehicles"))

  useEffect(() => {
    if (pathname.startsWith("/plates")) setPlatesOpen(true)
    if (pathname.startsWith("/vehicles")) setVehiclesOpen(true)
  }, [pathname])

  return (
    <Sidebar variant="floating">
      {/* Brand */}
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Shield className="size-[18px]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight">VRS — RDC</span>
                <span className="text-[10px] text-muted-foreground">
                  Système d'Immatriculation
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="my-1" />

      {/* Navigation */}
      <SidebarContent>
        {/* Général group */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3">
            Général
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-[15px] shrink-0" />
                    <span>Tableau de bord</span>
                  </Link>
                </SidebarMenuButton>
                {pathname === "/dashboard" && (
                  <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestion group — Plaques with sub-items, then Véhicules */}
        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3">
            Gestion
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">

              {/* Plaques — collapsible */}
              {(() => {
                return (
                  <SidebarMenuItem>
                    <Collapsible open={platesOpen} onOpenChange={setPlatesOpen} className="group/plates w-full">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={false}
                          className="gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground w-full"
                        >
                          <Hash className="size-[15px] shrink-0" />
                          <span>Plaques</span>
                          <ChevronRight className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/plates:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-0.5 gap-0.5 border-l border-border/50 pl-3">
                          {platesSubItems.map((sub) => {
                            const isSubActive = sub.href === "/plates"
                              ? pathname === "/plates"
                              : pathname.startsWith(sub.href)
                            return (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className="gap-2 rounded-md text-[12.5px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground"
                                >
                                  <Link href={sub.href}>
                                    <MapPin className="size-3 shrink-0" />
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                )
              })()}

              {/* Véhicules — collapsible */}
              {(() => {
                return (
                  <SidebarMenuItem>
                    <Collapsible open={vehiclesOpen} onOpenChange={setVehiclesOpen} className="group/vehicles w-full">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={false}
                          className="gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground w-full"
                        >
                          <Car className="size-[15px] shrink-0" />
                          <span>Véhicules</span>
                          <ChevronRight className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/vehicles:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-0.5 gap-0.5 border-l border-border/50 pl-3">
                          {vehiclesSubItems.map((sub) => {
                            const isSubActive = sub.href === "/vehicles"
                              ? pathname === "/vehicles"
                              : pathname.startsWith(sub.href)
                            return (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className="gap-2 rounded-md text-[12.5px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground"
                                >
                                  <Link href={sub.href}>
                                    <MapPin className="size-3 shrink-0" />
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                )
              })()}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Remaining groups */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all hover:bg-primary/5! hover:text-foreground! data-[active=true]:bg-primary/10! data-[active=true]:text-foreground"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-[15px] shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {isActive && (
                        <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User footer */}
      <SidebarSeparator className="mt-auto mb-1" />
      <SidebarFooter className="pt-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="gap-3 rounded-xl hover:bg-primary/5! hover:text-foreground! data-[state=open]:bg-primary/10! data-[state=open]:text-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                      {mockUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{mockUser.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      @{mockUser.username}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] font-semibold"
                  >
                    {mockUser.role}
                  </Badge>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-52"
              >
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  Paramètres du compte
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
