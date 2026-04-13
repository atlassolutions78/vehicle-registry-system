"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nom d'utilisateur ou mot de passe incorrect." }
        default:
          return { error: "Une erreur est survenue. Veuillez réessayer." }
      }
    }
    // Re-throw — Next.js redirect throws internally and must be re-thrown
    throw error
  }
}
