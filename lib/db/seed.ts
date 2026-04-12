import { config } from "dotenv"

// Load .env before anything else
config({ path: ".env" })

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { hash } from "bcryptjs"
import * as schema from "./schema"
import { plates, users, vehicles } from "./schema"

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle(client, { schema })

async function seed() {
  console.log("🌱 Seeding database…")

  // ── Users ────────────────────────────────────────────────────────────────────
  console.log("  → users")
  await db.delete(users)

  const passwordHash = await hash("admin123", 12)

  const [admin] = await db
    .insert(users)
    .values({
      name: "Jean-Pierre Kalala",
      username: "jp.kalala",
      role: "ADMIN",
      passwordHash,
    })
    .returning()

  console.log(`     Created admin: ${admin.username} / admin123`)

  // ── Plates ───────────────────────────────────────────────────────────────────
  console.log("  → plates")
  await db.delete(plates)

  const plateRows = await db
    .insert(plates)
    .values([
      // Nord-Kivu
      {
        provinceCode: "NKV",
        digits: "0012",
        letters: "AA",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2025-01-10"),
      },
      {
        provinceCode: "NKV",
        digits: "0023",
        letters: "AB",
        year: "19",
        status: "disponible",
      },
      {
        provinceCode: "NKV",
        digits: "1000",
        letters: "AC",
        year: "19",
        status: "disponible",
      },
      {
        provinceCode: "NKV",
        digits: "1234",
        letters: "AD",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2025-01-08"),
      },
      {
        provinceCode: "NKV",
        digits: "2341",
        letters: "AE",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2025-01-05"),
      },
      {
        provinceCode: "NKV",
        digits: "2500",
        letters: "AF",
        year: "19",
        status: "disponible",
      },
      {
        provinceCode: "NKV",
        digits: "3567",
        letters: "AG",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2025-01-04"),
      },
      {
        provinceCode: "NKV",
        digits: "4890",
        letters: "AH",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2025-01-03"),
      },
      {
        provinceCode: "NKV",
        digits: "7891",
        letters: "AI",
        year: "19",
        status: "attribuee",
        assignedAt: new Date("2024-12-31"),
      },
      {
        provinceCode: "NKV",
        digits: "8888",
        letters: "AJ",
        year: "19",
        status: "disponible",
      },
      // Sud-Kivu
      {
        provinceCode: "SKV",
        digits: "0456",
        letters: "BA",
        year: "22",
        status: "disponible",
      },
      {
        provinceCode: "SKV",
        digits: "0847",
        letters: "BC",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2025-01-09"),
      },
      {
        provinceCode: "SKV",
        digits: "1456",
        letters: "BD",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2025-01-07"),
      },
      {
        provinceCode: "SKV",
        digits: "2098",
        letters: "BE",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2025-01-06"),
      },
      {
        provinceCode: "SKV",
        digits: "4321",
        letters: "BF",
        year: "22",
        status: "disponible",
      },
      {
        provinceCode: "SKV",
        digits: "5234",
        letters: "BG",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2025-01-02"),
      },
      {
        provinceCode: "SKV",
        digits: "6543",
        letters: "BH",
        year: "22",
        status: "disponible",
      },
      {
        provinceCode: "SKV",
        digits: "6789",
        letters: "BI",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2025-01-01"),
      },
      {
        provinceCode: "SKV",
        digits: "9012",
        letters: "BJ",
        year: "22",
        status: "attribuee",
        assignedAt: new Date("2024-12-30"),
      },
      {
        provinceCode: "SKV",
        digits: "9500",
        letters: "BK",
        year: "22",
        status: "disponible",
      },
    ])
    .returning()

  console.log(`     Created ${plateRows.length} plates`)

  // ── Vehicles ─────────────────────────────────────────────────────────────────
  console.log("  → vehicles")
  await db.delete(vehicles)

  const nkv = (letters: string) =>
    plateRows.find((p) => p.provinceCode === "NKV" && p.letters === letters)
  const skv = (letters: string) =>
    plateRows.find((p) => p.provinceCode === "SKV" && p.letters === letters)

  const vehicleRows = await db
    .insert(vehicles)
    .values([
      {
        plateId: nkv("AA")?.id,
        owner: "Mbeki Alain",
        address: "Av. Kasa-Vubu, N°14, Commune de Lingwala, Kinshasa",
        taxNumber: "A1234567B",
        usage: "Privé",
        firstCirculation: 2020,
        make: "Toyota",
        type: "Corolla",
        chassisNumber: "JTDBL40E099123456",
        engineNumber: "2ZR9834521",
        yearFabrication: 2019,
        color: "Blanc",
        fiscalPower: 7,
        status: "actif",
        nfcUid: "04:A3:2B:1F:9C:00",
      },
      {
        plateId: skv("BC")?.id,
        owner: "Société SAMBU SPRL",
        address: "Bd du 30 Juin, N°88, Commune de la Gombe, Kinshasa",
        taxNumber: "B9876543C",
        usage: "Commercial",
        firstCirculation: 2019,
        make: "Isuzu",
        type: "D-Max",
        chassisNumber: "IADTF8HS5K1234567",
        engineNumber: "4JJ1234567",
        yearFabrication: 2019,
        color: "Argent",
        fiscalPower: 11,
        status: "actif",
        nfcUid: "04:B7:4C:2E:AA:01",
      },
      {
        plateId: skv("BA")?.id,
        owner: "Lokuta Marie",
        address: "Av. des Huileries, N°7, Commune de Barumbu, Kinshasa",
        taxNumber: "C5544332D",
        usage: "Privé",
        firstCirculation: 2021,
        make: "Honda",
        type: "CR-V",
        chassisNumber: "5J6RM4H78ML012345",
        engineNumber: "K24W012345",
        yearFabrication: 2021,
        color: "Noir",
        fiscalPower: 8,
        status: "en_attente",
      },
      {
        plateId: nkv("AD")?.id,
        owner: "Kabila Joseph",
        address: "Av. Pumbu, N°32, Commune de Ngaliema, Kinshasa",
        taxNumber: "D1122334E",
        usage: "Privé",
        firstCirculation: 2018,
        make: "Toyota",
        type: "Land Cruiser",
        chassisNumber: "JTMHX05J284012345",
        engineNumber: "1VD012345",
        yearFabrication: 2018,
        color: "Blanc",
        fiscalPower: 17,
        status: "actif",
        nfcUid: "04:C9:5D:3A:BB:02",
      },
      {
        plateId: skv("BE")?.id,
        owner: "Entreprise KONGO",
        address: "Zone Industrielle, Av. du Port, Matadi",
        taxNumber: "E6677889F",
        usage: "Commercial",
        firstCirculation: 2022,
        make: "Mercedes-Benz",
        type: "Sprinter 316",
        chassisNumber: "WDB9066351S123456",
        engineNumber: "OM651123456",
        yearFabrication: 2022,
        color: "Blanc",
        fiscalPower: 9,
        status: "suspendu",
      },
    ])
    .returning()

  console.log(`     Created ${vehicleRows.length} vehicles`)

  console.log("\n✅ Done!")
  await client.end()
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
