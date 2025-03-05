import { Router } from "express";
import { getUserById, getUsers } from "../controller/user.controller";
import { hasAccess, isAuthenticated } from "../middleware/authentication";

const userRouter = Router();

userRouter.get("/", isAuthenticated, hasAccess, getUsers);
userRouter.get("/:id", isAuthenticated, hasAccess, getUserById);

export default userRouter;
