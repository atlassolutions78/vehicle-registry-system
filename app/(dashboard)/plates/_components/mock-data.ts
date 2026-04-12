export type PlateStatus = "disponible" | "attribuee"

export interface Plate {
  id: string
  province: string
  digits: string   // "5658"
  letters: string  // "AA"
  year?: string    // "19" or "22"
  status: PlateStatus
  owner?: string
  vehicle?: string
  usage?: string
  assignedAt?: string
}

export const PROVINCES = [
  { code: "KIN", name: "Kinshasa" },
  { code: "CGO", name: "Kongo Central" },
  { code: "KAT", name: "Haut-Katanga" },
  { code: "NKV", name: "Nord-Kivu" },
  { code: "SKV", name: "Sud-Kivu" },
  { code: "EQU", name: "Équateur" },
  { code: "KOR", name: "Kasaï Oriental" },
  { code: "KOC", name: "Kasaï Occidental" },
  { code: "MAN", name: "Maniema" },
  { code: "BDU", name: "Bandundu" },
]

export const mockPlates: Plate[] = [
  { id: "P-001", province: "NKV", digits: "0012", letters: "AA", year: "19", status: "attribuee", owner: "Mbeki Alain", vehicle: "Toyota Corolla 2020", usage: "Privé", assignedAt: "10 jan. 2025" },
  { id: "P-002", province: "NKV", digits: "0023", letters: "AB", year: "19", status: "disponible" },
  { id: "P-003", province: "SKV", digits: "0456", letters: "BA", year: "22", status: "disponible" },
  { id: "P-004", province: "SKV", digits: "0847", letters: "BC", year: "22", status: "attribuee", owner: "Société SAMBU SPRL", vehicle: "Isuzu D-Max 2019", usage: "Commercial", assignedAt: "09 jan. 2025" },
  { id: "P-005", province: "NKV", digits: "1000", letters: "AC", year: "19", status: "disponible" },
  { id: "P-006", province: "NKV", digits: "1234", letters: "AD", year: "19", status: "attribuee", owner: "Lokuta Marie", vehicle: "Honda CR-V 2021", usage: "Privé", assignedAt: "08 jan. 2025" },
  { id: "P-007", province: "SKV", digits: "1456", letters: "BD", year: "22", status: "attribuee", owner: "Kabila Joseph", vehicle: "Land Cruiser 2018", usage: "Privé", assignedAt: "07 jan. 2025" },
  { id: "P-008", province: "SKV", digits: "2098", letters: "BE", year: "22", status: "attribuee", owner: "Entreprise KONGO", vehicle: "Mercedes Sprinter 2022", usage: "Commercial", assignedAt: "06 jan. 2025" },
  { id: "P-009", province: "NKV", digits: "2341", letters: "AE", year: "19", status: "attribuee", owner: "Mutombo André", vehicle: "Mitsubishi Pajero 2017", usage: "Privé", assignedAt: "05 jan. 2025" },
  { id: "P-010", province: "NKV", digits: "2500", letters: "AF", year: "19", status: "disponible" },
  { id: "P-011", province: "NKV", digits: "3567", letters: "AG", year: "19", status: "attribuee", owner: "ONG SANTÉ PLUS", vehicle: "Toyota Hilux 2023", usage: "Officiel", assignedAt: "04 jan. 2025" },
  { id: "P-012", province: "SKV", digits: "4321", letters: "BF", year: "22", status: "disponible" },
  { id: "P-013", province: "NKV", digits: "4890", letters: "AH", year: "19", status: "attribuee", owner: "Nkosi Bernard", vehicle: "Hyundai Tucson 2020", usage: "Privé", assignedAt: "03 jan. 2025" },
  { id: "P-014", province: "SKV", digits: "5234", letters: "BG", year: "22", status: "attribuee", owner: "Transporteurs LUKUTU", vehicle: "Ford Transit 2021", usage: "Commercial", assignedAt: "02 jan. 2025" },
  { id: "P-015", province: "SKV", digits: "6543", letters: "BH", year: "22", status: "disponible" },
  { id: "P-016", province: "SKV", digits: "6789", letters: "BI", year: "22", status: "attribuee", owner: "Diallo Fatou", vehicle: "Renault Duster 2019", usage: "Privé", assignedAt: "01 jan. 2025" },
  { id: "P-017", province: "NKV", digits: "7891", letters: "AI", year: "19", status: "attribuee", owner: "Ministère des Transports", vehicle: "Toyota Prado 2022", usage: "Officiel", assignedAt: "31 déc. 2024" },
  { id: "P-018", province: "NKV", digits: "8888", letters: "AJ", year: "19", status: "disponible" },
  { id: "P-019", province: "SKV", digits: "9012", letters: "BJ", year: "22", status: "attribuee", owner: "Kazadi Pierre", vehicle: "Nissan Navara 2020", usage: "Privé", assignedAt: "30 déc. 2024" },
  { id: "P-020", province: "SKV", digits: "9500", letters: "BK", year: "22", status: "disponible" },
]

export const mockVehiclesForAssign = [
  { id: "VEH-006", label: "Nguba Serge — Toyota RAV4 2021" },
  { id: "VEH-007", label: "Société MATADI SPRL — Isuzu NLR 2022" },
  { id: "VEH-008", label: "Lumumba Jean — Mitsubishi L200 2020" },
  { id: "VEH-009", label: "Kibangu Grace — Honda Pilot 2023" },
  { id: "VEH-010", label: "Bureau ONU-KINSHASA — Land Cruiser 2023" },
]
