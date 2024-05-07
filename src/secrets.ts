import dotenv from "dotenv"

dotenv.config({path: '.env'}) // Loads .env file contents into process.env by default.

export const PORT = process.env.PORT