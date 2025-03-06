import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../db/models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface IReq extends Request {
  user: IUser | null;
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, email, mobile, password, role } = req.body;
    if (role === "admin") {
      res.status(406).json({
        message: "You are not allowed to register as admin",
        success: false,
      });
      return;
    }

    const hash = await bcrypt.hash(password, await bcrypt.genSalt());
    const newUser = await new User({
      userName,
      email,
      password: hash,
      mobile,
      role,
      isVerified: false,
      orderHistory: [],
      cart: [],
      shippingAddress: [],
      reviews: [],
    }).save();

    if (newUser) {
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET!, {
        expiresIn: "1D",
      });
      res.cookie("AUTH_COOKIE", token);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { user: newUser, token },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accesor, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: accesor }, { userName: accesor }, { mobile: accesor }],
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Wrong credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET!, {
      expiresIn: "1D",
    });
    res.cookie("AUTH_COOKIE", token);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as IReq).user = null;
    res.clearCookie("AUTH_COOKIE");
    res
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, signOut };
