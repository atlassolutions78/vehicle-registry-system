import "server-only"

import { and, asc, desc, eq, ilike, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { plates } from "@/lib/db/schema"
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
          )
        )
      }

      const [rows, [{ count }]] = await Promise.all([
        db.select().from(plates)
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(plates.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: db.$count(plates, conditions.length ? and(...conditions) : undefined) })
          .from(plates),
      ])

      return { rows, count: Number(count) }
    }),

  byId: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const row = await db.query.plates.findFirst({ where: eq(plates.id, input) })
      if (!row) throw new Error("Plate not found")
      return row
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

  assign: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .update(plates)
        .set({ status: "attribuee", assignedAt: new Date() })
        .where(eq(plates.id, input.id))
        .returning()
      return row
    }),

  release: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .update(plates)
        .set({ status: "disponible", assignedAt: null })
        .where(eq(plates.id, input.id))
        .returning()
      return row
    }),

  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      await db.delete(plates).where(eq(plates.id, input))
    }),
})
