import { Request, Response, NextFunction } from "express"

const setLangCookie = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.lang) {
    res.cookie("lang", "pt-BR")
  }
  next()
}

export default setLangCookie
