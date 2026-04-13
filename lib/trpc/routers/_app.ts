import "server-only"

import { createTRPCRouter } from "../init"
import { platesRouter } from "./plates"
import { vehiclesRouter } from "./vehicles"

export const appRouter = createTRPCRouter({
  plates: platesRouter,
  vehicles: vehiclesRouter,
})

export type AppRouter = typeof appRouter
