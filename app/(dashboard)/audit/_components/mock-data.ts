export type ActionType =
  | "vehicule_enregistre"
  | "vehicule_modifie"
  | "vehicule_suspendu"
  | "vehicule_active"
  | "plaque_creee"
  | "plaque_attribuee"
  | "utilisateur_cree"
  | "utilisateur_desactive"
  | "utilisateur_active"
  | "nfc_verifie"
  | "nfc_lie"

export type EntityType = "vehicule" | "plaque" | "utilisateur" | "nfc"

export interface AuditEntry {
  id: string
  user: {
    name: string
    username: string
    initials: string
    role: string
  }
  action: ActionType
  entity: EntityType
  description: string
  timestamp: string
}

export const actionEntityMap: Record<ActionType, EntityType> = {
  vehicule_enregistre: "vehicule",
  vehicule_modifie: "vehicule",
  vehicule_suspendu: "vehicule",
  vehicule_active: "vehicule",
  plaque_creee: "plaque",
  plaque_attribuee: "plaque",
  utilisateur_cree: "utilisateur",
  utilisateur_desactive: "utilisateur",
  utilisateur_active: "utilisateur",
  nfc_verifie: "nfc",
  nfc_lie: "nfc",
}

export const mockAuditLog: AuditEntry[] = [
  {
    id: "LOG-025",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_cree",
    entity: "utilisateur",
    description: "a créé le compte @o.kabila (Odette Kabila · Lecteur)",
    timestamp: "20 jan. à 11h42",
  },
  {
    id: "LOG-024",
    user: { name: "Aminata Diallo", username: "a.diallo", initials: "AD", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de Paluku Serge — Mitsubishi L200 (NKV)",
    timestamp: "20 jan. à 10h15",
  },
  {
    id: "LOG-023",
    user: { name: "Roger Mukendi", username: "r.mukendi", initials: "RM", role: "AGENT" },
    action: "plaque_attribuee",
    entity: "plaque",
    description: "a attribué la plaque NKV · 5509 · AM · 19 à Paluku Serge",
    timestamp: "20 jan. à 10h18",
  },
  {
    id: "LOG-022",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_desactive",
    entity: "utilisateur",
    description: "a désactivé le compte @f.mwamba (Fiston Mwamba)",
    timestamp: "19 jan. à 16h50",
  },
  {
    id: "LOG-021",
    user: { name: "Hervé Kabamba", username: "h.kabamba", initials: "HK", role: "AGENT" },
    action: "nfc_verifie",
    entity: "nfc",
    description: "a vérifié la carte NFC 04:A3:2B:1F:9C:00 — Toyota Corolla (Mbeki Alain)",
    timestamp: "19 jan. à 14h30",
  },
  {
    id: "LOG-020",
    user: { name: "Marie-Claire Tshimanga", username: "mc.tshimanga", initials: "MT", role: "ADMIN" },
    action: "vehicule_suspendu",
    entity: "vehicule",
    description: "a suspendu le véhicule de Entreprise KONGO — Mercedes Sprinter (SKV)",
    timestamp: "19 jan. à 09h05",
  },
  {
    id: "LOG-019",
    user: { name: "Blaise Kasongo", username: "b.kasongo", initials: "BK", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de ONU-MONUSCO — Toyota Land Cruiser 300 (SKV)",
    timestamp: "17 jan. à 15h20",
  },
  {
    id: "LOG-018",
    user: { name: "Aminata Diallo", username: "a.diallo", initials: "AD", role: "AGENT" },
    action: "plaque_creee",
    entity: "plaque",
    description: "a créé la plaque SKV · 1870 · BB · 22",
    timestamp: "17 jan. à 11h00",
  },
  {
    id: "LOG-017",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_cree",
    entity: "utilisateur",
    description: "a créé le compte @f.mwamba (Fiston Mwamba · Agent)",
    timestamp: "17 jan. à 08h30",
  },
  {
    id: "LOG-016",
    user: { name: "Roger Mukendi", username: "r.mukendi", initials: "RM", role: "AGENT" },
    action: "nfc_verifie",
    entity: "nfc",
    description: "a vérifié la carte NFC 04:B7:4C:2E:AA:01 — Isuzu D-Max (Société SAMBU SPRL)",
    timestamp: "15 jan. à 13h45",
  },
  {
    id: "LOG-015",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_cree",
    entity: "utilisateur",
    description: "a créé le compte @h.kabamba (Hervé Kabamba · Agent)",
    timestamp: "15 jan. à 08h00",
  },
  {
    id: "LOG-014",
    user: { name: "Hervé Kabamba", username: "h.kabamba", initials: "HK", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de Zawadi Honorine — Suzuki Vitara (SKV)",
    timestamp: "14 jan. à 16h10",
  },
  {
    id: "LOG-013",
    user: { name: "Aminata Diallo", username: "a.diallo", initials: "AD", role: "AGENT" },
    action: "utilisateur_desactive",
    entity: "utilisateur",
    description: "a désactivé le compte @s.mbuyi (Sylvie Mbuyi)",
    timestamp: "14 jan. à 10h22",
  },
  {
    id: "LOG-012",
    user: { name: "Blaise Kasongo", username: "b.kasongo", initials: "BK", role: "AGENT" },
    action: "plaque_attribuee",
    entity: "plaque",
    description: "a attribué la plaque NKV · 3312 · AK · 19 à Bauma Christophe",
    timestamp: "12 jan. à 14h00",
  },
  {
    id: "LOG-011",
    user: { name: "Blaise Kasongo", username: "b.kasongo", initials: "BK", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de Bauma Christophe — Nissan Patrol (NKV)",
    timestamp: "12 jan. à 13h55",
  },
  {
    id: "LOG-010",
    user: { name: "Marie-Claire Tshimanga", username: "mc.tshimanga", initials: "MT", role: "ADMIN" },
    action: "vehicule_active",
    entity: "vehicule",
    description: "a activé le véhicule de Lokuta Marie — Honda CR-V (SKV)",
    timestamp: "12 jan. à 09h30",
  },
  {
    id: "LOG-009",
    user: { name: "Roger Mukendi", username: "r.mukendi", initials: "RM", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de SOCOGEKI SARL — Toyota Hiace (NKV)",
    timestamp: "10 jan. à 15h40",
  },
  {
    id: "LOG-008",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "nfc_lie",
    entity: "nfc",
    description: "a lié la carte NFC 04:A1:91:7E:FF:06 au véhicule Toyota Land Cruiser Prado",
    timestamp: "10 jan. à 11h15",
  },
  {
    id: "LOG-007",
    user: { name: "Marie-Claire Tshimanga", username: "mc.tshimanga", initials: "MT", role: "ADMIN" },
    action: "plaque_creee",
    entity: "plaque",
    description: "a créé la plaque NKV · 4420 · AL · 19",
    timestamp: "10 jan. à 09h00",
  },
  {
    id: "LOG-006",
    user: { name: "Blaise Kasongo", username: "b.kasongo", initials: "BK", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de Ministère des Transports — Toyota Land Cruiser Prado (SKV)",
    timestamp: "07 jan. à 14h25",
  },
  {
    id: "LOG-005",
    user: { name: "Roger Mukendi", username: "r.mukendi", initials: "RM", role: "AGENT" },
    action: "plaque_attribuee",
    entity: "plaque",
    description: "a attribué la plaque SKV · 7891 · AI · 22 au Ministère des Transports",
    timestamp: "07 jan. à 14h30",
  },
  {
    id: "LOG-004",
    user: { name: "Aminata Diallo", username: "a.diallo", initials: "AD", role: "AGENT" },
    action: "vehicule_enregistre",
    entity: "vehicule",
    description: "a enregistré le véhicule de Transporteurs LUKUTU — Ford Transit (NKV)",
    timestamp: "05 jan. à 10h50",
  },
  {
    id: "LOG-003",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "nfc_verifie",
    entity: "nfc",
    description: "a vérifié la carte NFC 04:E5:7F:5C:DD:04 — Toyota Hilux (ONG SANTÉ PLUS)",
    timestamp: "04 jan. à 16h00",
  },
  {
    id: "LOG-002",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_cree",
    entity: "utilisateur",
    description: "a créé le compte @mc.tshimanga (Marie-Claire Tshimanga · Admin)",
    timestamp: "02 jan. à 09h00",
  },
  {
    id: "LOG-001",
    user: { name: "Jean-Pierre Kalala", username: "jp.kalala", initials: "JK", role: "ADMIN" },
    action: "utilisateur_cree",
    entity: "utilisateur",
    description: "a créé le compte @a.diallo (Aminata Diallo · Agent)",
    timestamp: "02 jan. à 08h45",
  },
]
