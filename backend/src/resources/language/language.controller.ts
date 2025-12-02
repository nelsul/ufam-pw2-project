import { Request, Response } from "express"

export const changeLanguage = (req: Request, res: Response) => {
  const { lang } = req.body
  res.cookie("lang", lang)
  res.status(200).json({ message: "Language updated" })
}
