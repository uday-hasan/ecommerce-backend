import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { MongoAPIError, MongoError, MongoServerError } from "mongodb";
import { mongo, MongooseError, Error } from "mongoose";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Global Error:", err);
  if (err instanceof JsonWebTokenError) {
    if (err.name === "JsonWebTokenError") {
      res.status(402).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    } else if (err.name === "TokenExpiredError") {
      res.status(403).json({
        success: false,
        message: "Session end, login again.",
      });
      return;
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }
  if (err instanceof Error.ValidationError) {
    const { errors } = err;
    const msg = Object.values(errors)
      .map((e) => e.message)
      .join(", ")
      .toString();
    res.status(422).json({
      success: false,
      message: msg,
    });
    return;
  }
  if (err.code === 11000) {
    const val = Object.keys(err.keyValue).map((e) => e);
    console.log(val);
    res.status(400).json({
      success: false,
      message: `Duplicate entry found ${val}`,
    });
    return;
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}
export default errorHandler;
