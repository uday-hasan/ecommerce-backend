import { config } from "dotenv";

config({ path: "./.env.development.local" });

export const { PORT, DB_URL, JWT_SECRET } = process.env;
