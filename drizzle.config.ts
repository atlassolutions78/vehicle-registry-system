import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env" })

export default defineConfig({
  out: "./lib/db/migrations",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
