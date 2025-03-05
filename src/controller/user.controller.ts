import { Types } from "mongoose";
import User from "../db/models/user.model";
import { NextFunction, Request, Response } from "express";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "User found", data: { user } });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({
        success: true,
        data: { user: users },
        message: "Users fetched successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Users fetched failed",
      });
    }
  } catch (error) {}
};

export { getUserById, getUsers };
