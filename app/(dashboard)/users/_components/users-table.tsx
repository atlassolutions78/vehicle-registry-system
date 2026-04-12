import { MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AppUser } from "./mock-data"

const roleConfig: Record<string, { label: string; className: string }> = {
  ADMIN: { label: "Admin", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  AGENT: { label: "Agent", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  LECTEUR: { label: "Lecteur", className: "bg-muted text-muted-foreground" },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  actif: { label: "Actif", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  inactif: { label: "Inactif", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

interface UsersTableProps {
  users: AppUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date d&apos;ajout</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
              Aucun utilisateur trouvé.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => {
            const role = roleConfig[user.role]
            const status = statusConfig[user.status]
            return (
              <TableRow key={user.id}>
                {/* User */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${role.className}`}>
                    {role.label}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </TableCell>

                {/* Created at */}
                <TableCell className="text-sm text-muted-foreground">
                  {user.createdAt}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Réinitialiser le mot de passe</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={user.status === "actif" ? "text-destructive focus:bg-destructive/10 focus:text-destructive" : ""}>
                        {user.status === "actif" ? "Désactiver" : "Activer"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
