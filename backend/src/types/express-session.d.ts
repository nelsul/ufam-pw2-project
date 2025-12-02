import "express-session"
import { UserType } from "@prisma/client"

declare module "express-session" {
  interface SessionData {
    userId: string
    userType: UserType
  }
}
