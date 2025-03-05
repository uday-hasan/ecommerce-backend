import { Request, Response, NextFunction } from "express";
import User from "../db/models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, email, mobile, password } = req.body;
    if (!userName || !email || !mobile || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email, mobile and password all fields are required",
      });
      return;
    }
    const isExistUser = await User.findOne({
      $or: [{ email }, { mobile }, { userName }],
    });
    if (isExistUser) {
      res.status(409).json({
        success: false,
        message: "User exist by email or mobile or username",
      });
      return;
    }

    const hash = await bcrypt.hash(password, await bcrypt.genSalt());
    const newUser = await new User({
      userName,
      email,
      password: hash,
      mobile,
      role: "user",
      isVerified: false,
      orderHistory: [],
      cart: [],
      shippingAddress: [],
      reviews: [],
    }).save();

    if (newUser) {
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET!);
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

export { register, login };
