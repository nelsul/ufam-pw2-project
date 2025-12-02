import { Request, Response, NextFunction } from "express"
import { UserType } from "../generated/prisma"

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userType !== UserType.ADMIN) {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}

export default isAdmin
