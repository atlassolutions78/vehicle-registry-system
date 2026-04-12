import "server-only"

import { and, desc, eq, ilike, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { vehicles } from "@/lib/db/schema"
import { createTRPCRouter, publicProcedure } from "../init"

const vehicleInput = z.object({
  plateId: z.string().uuid().optional(),
  owner: z.string().min(1),
  address: z.string().min(1),
  taxNumber: z.string().min(1),
  usage: z.string().min(1),
  firstCirculation: z.number().int().min(1900),
  make: z.string().min(1),
  type: z.string().min(1),
  chassisNumber: z.string().min(1),
  engineNumber: z.string().min(1),
  yearFabrication: z.number().int().min(1900),
  color: z.string().min(1),
  fiscalPower: z.number().int().min(1),
  nfcUid: z.string().optional(),
})

export const vehiclesRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({
      provinceCode: z.string().optional(),
      status: z.enum(["actif", "suspendu", "en_attente"]).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const conditions = []
      if (input.status) conditions.push(eq(vehicles.status, input.status))
      if (input.search) {
        conditions.push(
          or(
            ilike(vehicles.owner, `%${input.search}%`),
            ilike(vehicles.make, `%${input.search}%`),
            ilike(vehicles.chassisNumber, `%${input.search}%`),
          )
        )
      }

      // provinceCode filter requires joining through plates
      const baseQuery = db.select().from(vehicles)

      const [rows, [{ count }]] = await Promise.all([
        baseQuery
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(vehicles.registeredAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: db.$count(vehicles, conditions.length ? and(...conditions) : undefined) })
          .from(vehicles),
      ])

      return { rows, count: Number(count) }
    }),

  byId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const row = await db.query.vehicles.findFirst({
        where: eq(vehicles.id, input),
        with: { plate: true },
      })
      if (!row) throw new Error("Vehicle not found")
      return row
    }),

  create: publicProcedure
    .input(vehicleInput)
    .mutation(async ({ input }) => {
      const [row] = await db.insert(vehicles).values(input).returning()
      return row
    }),

  update: publicProcedure
    .input(z.object({ id: z.string().uuid() }).merge(vehicleInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      const [row] = await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning()
      return row
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(["actif", "suspendu", "en_attente"]),
    }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .update(vehicles)
        .set({ status: input.status })
        .where(eq(vehicles.id, input.id))
        .returning()
      return row
    }),

  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      await db.delete(vehicles).where(eq(vehicles.id, input))
    }),
})
