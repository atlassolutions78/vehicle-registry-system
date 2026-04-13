import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Use the lightweight config (no DB) so the Edge runtime is happy
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon\\.ico|login).*)"],
}
