import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User, { IUser } from "../db/models/user.model";

interface IReq extends Request {
  user: IUser | null;
}
const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("isAuthenticate");
  try {
    // const token = req.headers.authorization;
    const token = req.cookies["AUTH_COOKIE"];

    // if (!token || !token.startsWith("Bearer")) {
    if (!token) {
      res.status(401).json({ message: "Unauthorized/no token" });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET!);
    console.log({ decoded });
    if (typeof decoded === "object" && "userId" in decoded) {
      const id = decoded.userId;
      const user = await User.findById(id).select("-password");
      if (!user) {
        res.status(404).json({ message: "Unauthorized/no user" });
        return;
      }
      (req as IReq).user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const hasAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as IReq).user;
    if (
      user &&
      (user.role === "admin" || String(user._id) === String(req.params.id))
    ) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    next(error);
  }
};

const vendorAccessOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as IReq).user;
    if (user && user.role === "vendor") {
      console.log("first");
      next();
    } else {
      res.clearCookie("AUTH_COOKIE");
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    next(error);
  }
};

const adminAccessOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as IReq).user;
    if (user && user.role === "admin") {
      next();
    } else {
      res.clearCookie("AUTH_COOKIE");
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    next(error);
  }
};

const vendorAdminAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as IReq).user;
    if (user && (user.role === "admin" || user.role === "vendor")) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    next(error);
  }
};
export {
  isAuthenticated,
  hasAccess,
  vendorAccessOnly,
  vendorAdminAccess,
  adminAccessOnly,
};
