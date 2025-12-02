import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import env from "./utils/getEnv"
import router from "./router"
import swaggerDocs from "./utils/swagger"

const app = express()
const PORT = env.PORT

app.use(express.json())
app.use(cookieParser())

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
)

app.use("/v1", router)

app.get("/", (req, res) => {
  res.send("Olá, bem-vindo(a) ao curso de PW2!")
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
  swaggerDocs(app, PORT)
})
