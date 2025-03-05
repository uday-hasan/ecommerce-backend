import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env";
import connectDB from "./db/connectDB";
import errorHandler from "./middleware/error.middleware";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/auth", async (req: Request, res: Response) => {
  // res.send("Hello, world!");
  const d = req.cookies["AUTH_COOKIE"];
  console.log({ d });
  res.json({ d });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log("Server listening on http://localhost:" + PORT);
  await connectDB();
});
