import { integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

// ─── Enums ────────────────────────────────────────────────────────────────────

export const plateStatusEnum = pgEnum("plate_status", ["disponible", "attribuee"])
export const vehicleStatusEnum = pgEnum("vehicle_status", ["actif", "suspendu", "en_attente"])
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "AGENT", "VIEWER"])

// ─── Plates ───────────────────────────────────────────────────────────────────

export const plates = pgTable("plates", {
  id: uuid("id").primaryKey().defaultRandom(),
  provinceCode: text("province_code").notNull(),
  digits: text("digits").notNull(),
  letters: text("letters").notNull(),
  year: text("year"),
  status: plateStatusEnum("status").notNull().default("disponible"),
  assignedAt: timestamp("assigned_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  unique("plates_province_digits_letters_unique").on(t.provinceCode, t.digits, t.letters),
])

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  plateId: uuid("plate_id").references(() => plates.id, { onDelete: "set null" }),
  owner: text("owner").notNull(),
  address: text("address").notNull(),
  taxNumber: text("tax_number").notNull(),
  usage: text("usage").notNull(),
  firstCirculation: integer("first_circulation").notNull(),
  make: text("make").notNull(),
  type: text("type").notNull(),
  chassisNumber: text("chassis_number").notNull().unique(),
  engineNumber: text("engine_number").notNull(),
  yearFabrication: integer("year_fabrication").notNull(),
  color: text("color").notNull(),
  fiscalPower: integer("fiscal_power").notNull(),
  status: vehicleStatusEnum("status").notNull().default("en_attente"),
  nfcUid: text("nfc_uid").unique(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
})

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  role: userRoleEnum("role").notNull().default("AGENT"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ─── Audit logs ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type Plate = typeof plates.$inferSelect
export type NewPlate = typeof plates.$inferInsert
export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
