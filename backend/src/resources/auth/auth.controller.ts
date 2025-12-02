import { Request, Response } from "express"
import { authenticate } from "./auth.service"
import { LoginDto } from "./auth.types"

export const login = async (req: Request, res: Response) => {
  const credentials: LoginDto = req.body

  try {
    const user = await authenticate(credentials)

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    req.session.userId = user.id
    req.session.userType = user.userType

    res.status(200).json({ message: "Login successful" })
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" })
    }
    res.status(200).json({ message: "Logout successful" })
  })
}

export const getCurrentUser = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.status(200).json({
      userId: req.session.userId,
      userType: req.session.userType,
    })
  } else {
    res.status(401).json({ message: "Not authenticated" })
  }
}
