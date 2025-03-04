import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./config/env";
import connectDB from "./db/connectDB";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.listen(PORT, async () => {
  console.log("Server listening on http://localhost:" + PORT);
  await connectDB();
});
