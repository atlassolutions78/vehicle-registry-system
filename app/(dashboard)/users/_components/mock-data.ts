export type UserRole = "ADMIN" | "AGENT" | "LECTEUR"
export type UserStatus = "actif" | "inactif"

export interface AppUser {
  id: string
  name: string
  username: string
  initials: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export const mockUsers: AppUser[] = [
  {
    id: "USR-001",
    name: "Jean-Pierre Kalala",
    username: "jp.kalala",
    initials: "JK",
    role: "ADMIN",
    status: "actif",
    createdAt: "02 jan. 2025",
  },
  {
    id: "USR-002",
    name: "Aminata Diallo",
    username: "a.diallo",
    initials: "AD",
    role: "AGENT",
    status: "actif",
    createdAt: "03 jan. 2025",
  },
  {
    id: "USR-003",
    name: "Roger Mukendi",
    username: "r.mukendi",
    initials: "RM",
    role: "AGENT",
    status: "actif",
    createdAt: "05 jan. 2025",
  },
  {
    id: "USR-004",
    name: "Cécile Ngoy",
    username: "c.ngoy",
    initials: "CN",
    role: "LECTEUR",
    status: "actif",
    createdAt: "07 jan. 2025",
  },
  {
    id: "USR-005",
    name: "Patrick Ilunga",
    username: "p.ilunga",
    initials: "PI",
    role: "AGENT",
    status: "inactif",
    createdAt: "08 jan. 2025",
  },
  {
    id: "USR-006",
    name: "Marie-Claire Tshimanga",
    username: "mc.tshimanga",
    initials: "MT",
    role: "ADMIN",
    status: "actif",
    createdAt: "10 jan. 2025",
  },
  {
    id: "USR-007",
    name: "Blaise Kasongo",
    username: "b.kasongo",
    initials: "BK",
    role: "AGENT",
    status: "actif",
    createdAt: "12 jan. 2025",
  },
  {
    id: "USR-008",
    name: "Sylvie Mbuyi",
    username: "s.mbuyi",
    initials: "SM",
    role: "LECTEUR",
    status: "inactif",
    createdAt: "14 jan. 2025",
  },
  {
    id: "USR-009",
    name: "Hervé Kabamba",
    username: "h.kabamba",
    initials: "HK",
    role: "AGENT",
    status: "actif",
    createdAt: "15 jan. 2025",
  },
  {
    id: "USR-010",
    name: "Nadège Lukusa",
    username: "n.lukusa",
    initials: "NL",
    role: "LECTEUR",
    status: "actif",
    createdAt: "17 jan. 2025",
  },
  {
    id: "USR-011",
    name: "Fiston Mwamba",
    username: "f.mwamba",
    initials: "FM",
    role: "AGENT",
    status: "inactif",
    createdAt: "19 jan. 2025",
  },
  {
    id: "USR-012",
    name: "Odette Kabila",
    username: "o.kabila",
    initials: "OK",
    role: "LECTEUR",
    status: "actif",
    createdAt: "20 jan. 2025",
  },
]
