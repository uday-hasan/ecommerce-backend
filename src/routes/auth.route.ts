import { Router } from "express";
import { login, register, signOut } from "../controller/auth.controller";
import { isAuthenticated } from "../middleware/authentication";

const authRouter = Router();

authRouter.post("/sign-up", register);
authRouter.post("/sign-in", login);
authRouter.post("/sign-out", isAuthenticated, signOut);

export default authRouter;
