import "server-only"

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { plates, vehicles } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "../init"

export const platesRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({
      provinceCode: z.string().optional(),
      status: z.enum(["disponible", "attribuee"]).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const conditions = []
      if (input.provinceCode) conditions.push(eq(plates.provinceCode, input.provinceCode))
      if (input.status) conditions.push(eq(plates.status, input.status))
      if (input.search) {
        conditions.push(
          or(
            ilike(plates.digits, `%${input.search}%`),
            ilike(plates.letters, `%${input.search}%`),
            ilike(vehicles.owner, `%${input.search}%`),
          )
        )
      }

      const where = conditions.length ? and(...conditions) : undefined

      const [rows, [{ total }]] = await Promise.all([
        db
          .select({
            id: plates.id,
            provinceCode: plates.provinceCode,
            digits: plates.digits,
            letters: plates.letters,
            year: plates.year,
            status: plates.status,
            assignedAt: plates.assignedAt,
            createdAt: plates.createdAt,
            owner: vehicles.owner,
            make: vehicles.make,
            type: vehicles.type,
            usage: vehicles.usage,
          })
          .from(plates)
          .leftJoin(vehicles, eq(vehicles.plateId, plates.id))
          .where(where)
          .orderBy(desc(plates.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db
          .select({ total: count() })
          .from(plates)
          .leftJoin(vehicles, eq(vehicles.plateId, plates.id))
          .where(where),
      ])

      return { rows, total }
    }),

  byId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const [row] = await db
        .select({
          id: plates.id,
          provinceCode: plates.provinceCode,
          digits: plates.digits,
          letters: plates.letters,
          year: plates.year,
          status: plates.status,
          assignedAt: plates.assignedAt,
          createdAt: plates.createdAt,
          owner: vehicles.owner,
          make: vehicles.make,
          type: vehicles.type,
          usage: vehicles.usage,
        })
        .from(plates)
        .leftJoin(vehicles, eq(vehicles.plateId, plates.id))
        .where(eq(plates.id, input))
      if (!row) throw new Error("Plate not found")
      return row
    }),

  // Exact lookup by province + digits + letters — used by the plate checker
  check: publicProcedure
    .input(z.object({
      provinceCode: z.string(),
      digits: z.string(),
      letters: z.string(),
    }))
    .query(async ({ input }) => {
      const [row] = await db
        .select({
          id: plates.id,
          provinceCode: plates.provinceCode,
          digits: plates.digits,
          letters: plates.letters,
          year: plates.year,
          status: plates.status,
          assignedAt: plates.assignedAt,
          owner: vehicles.owner,
          make: vehicles.make,
          type: vehicles.type,
          usage: vehicles.usage,
          vehicleId: vehicles.id,
        })
        .from(plates)
        .leftJoin(vehicles, eq(vehicles.plateId, plates.id))
        .where(
          and(
            eq(plates.provinceCode, input.provinceCode),
            eq(plates.digits, input.digits),
            sql`lower(${plates.letters}) = lower(${input.letters})`,
          )
        )
      return row ?? null
    }),

  create: publicProcedure
    .input(z.object({
      provinceCode: z.string().min(2).max(8),
      digits: z.string().min(1).max(8),
      letters: z.string().min(1).max(4),
      year: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await db.insert(plates).values(input).returning()
      return row
    }),

  // Assign a plate to a vehicle — updates both tables in a transaction
  assignToVehicle: publicProcedure
    .input(z.object({
      plateId: z.string().uuid(),
      vehicleId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx
          .update(plates)
          .set({ status: "attribuee", assignedAt: new Date() })
          .where(eq(plates.id, input.plateId))
        await tx
          .update(vehicles)
          .set({ plateId: input.plateId })
          .where(eq(vehicles.id, input.vehicleId))
      })
    }),

  release: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx
          .update(vehicles)
          .set({ plateId: null })
          .where(eq(vehicles.plateId, input.id))
        await tx
          .update(plates)
          .set({ status: "disponible", assignedAt: null })
          .where(eq(plates.id, input.id))
      })
    }),

  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      await db.delete(plates).where(eq(plates.id, input))
    }),
})
