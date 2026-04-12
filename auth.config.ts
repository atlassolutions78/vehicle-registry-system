import type { NextAuthConfig } from "next-auth"

// Lightweight config — no DB imports — safe for the Edge (middleware)
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === "/login"
      if (isLoginPage) return isLoggedIn ? Response.redirect(new URL("/dashboard", nextUrl)) : true
      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.username = (user as { username: string }).username
        token.role = (user as { role: string }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.username = token.username as string
      session.user.role = token.role as "ADMIN" | "AGENT" | "VIEWER"
      return session
    },
  },
  session: { strategy: "jwt" },
}
