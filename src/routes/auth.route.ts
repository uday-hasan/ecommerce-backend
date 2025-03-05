import { Router } from "express";
import { login, register } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", register);
authRouter.post("/sign-in", login);

export default authRouter;
