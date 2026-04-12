import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const parsed = z
            .object({ username: z.string().min(1), password: z.string().min(1) })
            .safeParse(credentials)
          if (!parsed.success) return null

          const user = await db.query.users.findFirst({
            where: eq(users.username, parsed.data.username),
          })
          if (!user) return null

          const valid = await compare(parsed.data.password, user.passwordHash)
          if (!valid) return null

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          }
        } catch (err) {
          console.error("[auth] authorize error:", err)
          return null
        }
      },
    }),
  ],
})
