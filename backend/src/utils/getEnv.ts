import { cleanEnv, str, port, url } from "envalid"
import dotenv from "dotenv"

dotenv.config()

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  PORT: port({ default: 7788 }),
  DATABASE_URL: url(),
  SESSION_SECRET: str(),
})

export default env
