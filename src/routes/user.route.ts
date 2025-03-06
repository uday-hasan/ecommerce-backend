import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controller/user.controller";
import {
  adminAccessOnly,
  hasAccess,
  isAuthenticated,
} from "../middleware/authentication";

const userRouter = Router();

userRouter.get("/", isAuthenticated, hasAccess, getUsers);
userRouter.get("/:id", isAuthenticated, hasAccess, getUserById);
userRouter.delete("/:id", isAuthenticated, adminAccessOnly, deleteUser);

export default userRouter;
